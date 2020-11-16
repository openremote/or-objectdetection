#region imports
import os
# comment out below line to enable tensorflow logging outputs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import time
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
		tf.config.experimental.set_memory_growth(physical_devices[0], True)
from absl import app, flags
from absl.flags import FLAGS
import core.utils as utils
from core.yolov4 import filter_boxes
from tensorflow.python.saved_model import tag_constants
from core.config import cfg
import cv2
import numpy as np
from tensorflow.compat.v1 import ConfigProto

import threading
import base64
#endregion

# helper files
from rabbitmq_helper import setup_rabbitMQ
import object_detection_helper as obj_helper


flags.DEFINE_string('framework', 'tf', '(tf, tflite, trt')
flags.DEFINE_string('weights', './checkpoints/yolov4-416',
										'path to weights file')
flags.DEFINE_integer('size', 416, 'resize images to')
flags.DEFINE_boolean('tiny', False, 'yolo or yolo-tiny')
flags.DEFINE_string('model', 'yolov4', 'yolov3 or yolov4')
flags.DEFINE_string('video', './data/video/test.mp4', 'path to input video or set to 0 for webcam')
flags.DEFINE_float('iou', 0.45, 'iou threshold')
flags.DEFINE_float('score', 0.50, 'score threshold')
flags.DEFINE_boolean('dont_show', False, 'dont show video output')
flags.DEFINE_boolean('info', False, 'show detailed info of tracked objects')
flags.DEFINE_boolean('count', False, 'count objects being tracked on screen')

import rabbitmq_helper as rabbit
(queue, exchange, producer) = rabbit.setup_rabbitMQ()

lock = threading.Lock()
# Definition of the parameters
nms_max_overlap = 1.0
max_cosine_distance = 0.4
nn_budget = None

def analyse_frame(frame, input_size, interpreter, input_details, output_details, infer, detection_classes = None):
		image_data = cv2.resize(frame, (input_size, input_size))
		image_data = image_data / 255.
		image_data = image_data[np.newaxis, ...].astype(np.float32)

		# run detections on tflite if flag is set
		if FLAGS.framework == 'tflite':
				interpreter.set_tensor(input_details[0]['index'], image_data)
				interpreter.invoke()
				pred = [interpreter.get_tensor(output_details[i]['index']) for i in range(len(output_details))]
				# run detections using yolov3 if flag is set
				if FLAGS.model == 'yolov3' and FLAGS.tiny == True:
						boxes, pred_conf = filter_boxes(pred[1], pred[0], score_threshold=0.25,
																						input_shape=tf.constant([input_size, input_size]))
				else:
						boxes, pred_conf = filter_boxes(pred[0], pred[1], score_threshold=0.25,
																						input_shape=tf.constant([input_size, input_size]))
		else:
				batch_data = tf.constant(image_data)
				pred_bbox = infer(batch_data)
				for key, value in pred_bbox.items():
						boxes = value[:, :, 0:4]
						pred_conf = value[:, :, 4:]

		boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
				boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
				scores=tf.reshape(
						pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
				max_output_size_per_class=50,
				max_total_size=50,
				iou_threshold=FLAGS.iou,
				score_threshold=FLAGS.score
		)

		# convert data to numpy arrays and slice out unused elements
		num_objects = valid_detections.numpy()[0]
		bboxes = boxes.numpy()[0]
		bboxes = bboxes[0:int(num_objects)]
		scores = scores.numpy()[0]
		scores = scores[0:int(num_objects)]
		classes = classes.numpy()[0]
		classes = classes[0:int(num_objects)]

		# format bounding boxes from normalized ymin, xmin, ymax, xmax ---> xmin, ymin, width, height
		original_h, original_w, _ = frame.shape
		bboxes = utils.format_boxes(bboxes, original_h, original_w)

		# store all predictions in one parameter for simplicity when calling functions
		pred_bbox = [bboxes, scores, classes, num_objects]

		# read in all class names from config
		class_names = utils.read_class_names(cfg.YOLO.CLASSES)

		# by default allow all classes in .names file
		if(detection_classes is None):
				detection_classes = list(class_names.values())
				
		# loop through objects and use class index to get class name, allow only classes in allowed_classes list
		names = []
		deleted_indx = []
		for i in range(num_objects):
				class_indx = int(classes[i])
				class_name = class_names[class_indx]
				if class_name not in detection_classes:
						deleted_indx.append(i)
				else:
						names.append(class_name)
		names = np.array(names)
		count = len(names)
		if FLAGS.count:
				cv2.putText(frame, "Objects being tracked: {}".format(count), (5, 35), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (0, 255, 0), 2)
				print("Objects being tracked: {}".format(count))
		# delete detections that are not in allowed_classes
		bboxes = np.delete(bboxes, deleted_indx, axis=0)
		scores = np.delete(scores, deleted_indx, axis=0)

		# return bboxes, frame

		# apply_deepsort(frame) 
		return frame, bboxes,scores, names

def main(_argv):
		encoder, tracker = obj_helper.init_deepsort(max_cosine_distance, nn_budget)
		outputFrame = None
		#region setup
		# load configuration for object detector
		config = ConfigProto()
		config.gpu_options.allow_growth = True
		input_size = FLAGS.size
		video_path = FLAGS.video

		# load tflite model if flag is set
		interpreter = None
		input_details = None
		output_details = None
		infer = None
		if FLAGS.framework == 'tflite':
				interpreter = tf.lite.Interpreter(model_path=FLAGS.weights)
				interpreter.allocate_tensors()
				input_details = interpreter.get_input_details()
				output_details = interpreter.get_output_details()
		# otherwise load standard tensorflow saved model
		else:
				saved_model_loaded = tf.saved_model.load(FLAGS.weights, tags=[tag_constants.SERVING])
				infer = saved_model_loaded.signatures['serving_default']

		# begin video capture
		try:
				vid = cv2.VideoCapture(int(video_path))
		except:
				vid = cv2.VideoCapture(video_path)

		#endregion

		frame_num = 0
		# while video is running
		while True:
				return_value, frame = vid.read()
				if return_value:
						frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
				else:
						print('Video has ended or failed, try a different video format!')
						break
				frame_num +=1

				start_time = time.time()

				#detection_classes=['person']
				frame, bboxes, scores, names = analyse_frame(frame, input_size, interpreter, input_details, output_details, infer, detection_classes=None)
				result = obj_helper.apply_deepsort(encoder, tracker, frame, bboxes, scores, names, nms_max_overlap)

				if not FLAGS.dont_show:
					cv2.imshow("Output Video", result)
		
				with lock:
					outputFrame = result

				fps = 1.0 / (time.time() - start_time)
				print("Frame " + str(frame_num) + " FPS: %.2f" % fps, end='\r')

				#publish frame to rabbitMQ
				(_, encodedImage) = cv2.imencode(".jpg", outputFrame)
				producer.publish(encodedImage.tobytes(), content_type='image/jpeg', content_encoding='binary')

				if cv2.waitKey(1) & 0xFF == ord('q'): break
		cv2.destroyAllWindows()

if __name__ == '__main__':
		try:
				app.run(main)
		except SystemExit:
				pass