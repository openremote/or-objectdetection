import json
from deep_sort import tracker
import time
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
		tf.config.experimental.set_memory_growth(physical_devices[0], True)
from absl.flags import FLAGS

import core.utils as utils
from core.yolov4 import filter_boxes
from core.config import cfg

import cv2
import numpy as np
import threading
import json
import cv2
import numpy as np
import threading
from kombu.mixins import ConsumerMixin
# helper files
import object_detection_helper as obj_helper
import rabbitmq_helper as rabbit
from stream_consumer import consume_stream

nms_max_overlap = 1.0
lock = threading.Lock()
max_cosine_distance = 0.4
nn_budget = None

(queue, exchange, producer, connection) = rabbit.setup_rabbitMQ()

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
		return frame, bboxes,scores, names

def consume_file(video_path):
	try:
		vid = cv2.VideoCapture(int(video_path))
	except:
		vid = cv2.VideoCapture(video_path)
	while True:
		return_value, frame = vid.read()
		if return_value:
			yield frame
		else:
			print('Video has ended or failed, try a different video format!')
			break

def start_analysis(video_path, interpreter, input_details, output_details, infer, encoder, tracker):
	frame_num = 0
	outputFrame = None
	# while video is running

	if False:
		video_consumer = consume_file(video_path)
	else:
		video_consumer = consume_stream(video_path, framerate = 20, quality='normal')

	for frame in video_consumer:
			frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
			frame_num += 1

			start_time = time.time()

			detection_classes = None
			# detection_classes=['person']
			frame, bboxes, scores, names = analyse_frame(frame, FLAGS.size, interpreter, input_details, output_details, infer, detection_classes=detection_classes)
			result = obj_helper.apply_deepsort(encoder, tracker, frame, bboxes, scores, names, nms_max_overlap)

			if not FLAGS.dont_show:
				cv2.imshow("Output Video", result)
	
			with lock:
				outputFrame = result

			fps = 1.0 / (time.time() - start_time)
			print("Frame " + str(frame_num) + " FPS: %.2f" % fps, end='\r')

			#publish frame to rabbitMQ
			(_, encodedImage) = cv2.imencode(".jpg", outputFrame)
			producer.publish(encodedImage.tobytes(), content_type='image/jpeg', content_encoding='binary',expiration=10)
			# if cv2.waitKey(1) & 0xFF == ord('q'): break
	cv2.destroyAllWindows()

# Kombu Message Consuming Worker
class Worker(ConsumerMixin, threading.Thread):
	is_busy = False
	def __init__(self, feed_queue, interpreter, input_details, output_details, infer, encoder, tracker):
			self.connection = connection

			self.queues = feed_queue
			
			self.interpreter = interpreter
			self.input_details = input_details
			self.output_details = output_details
			self.infer = infer
			self.encoder = encoder
			self.tracker = tracker
			super(Worker, self).__init__(daemon=True)

	def run(self):
			super(Worker, self).run()

	def get_consumers(self, Consumer, channel):
			return [Consumer(queues=self.queues, callbacks=[self.on_message], accept=['application/json'])]

	def on_message(self, raw_body, message):
		print("The body is {}".format(raw_body))
		if(not self.is_busy):
			message.ack()
			body = json.loads(raw_body)		
			url =  body['url']
			print('Message received!')
			self.is_busy = True
				
			start_analysis(url, self.interpreter, input_details=self.input_details, output_details=self.output_details, infer=self.infer, encoder=self.encoder, tracker=self.tracker)
			self.is_busy = False
