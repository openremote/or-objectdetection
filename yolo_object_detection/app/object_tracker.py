#region imports
from deep_sort import tracker
import os
# comment out below line to enable tensorflow logging outputs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from tensorflow.compat.v1 import ConfigProto
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
		tf.config.experimental.set_memory_growth(physical_devices[0], True)
from absl import app, flags
from absl.flags import FLAGS

from core.config import cfg
from tensorflow.python.saved_model import tag_constants

# helper files
import object_detection_helper as obj_helper

from threadedConsumer import Worker

#endregion
#region flags
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
#endregion
# Definition of the parameters

max_cosine_distance = 0.4
nn_budget = None

interpreter = None
input_details = None
output_details = None
infer = None
encoder = None
tracker = None

workers = []
from kombu import Exchange, Queue

feed_exchange = Exchange("feed-exchange", type="direct", delivery_mode=1)
feed_queue = Queue(name="feed-queue", exchange=feed_exchange, routing_key="feed") 

def start_feed_listener():
	print('starting to fucking listen')
	global workers
	worker = Worker(feed_queue, interpreter, input_details, output_details, infer, encoder, tracker)
	workers.append(worker)
	worker.start()

def main(_argv):
	global encoder 
	global tracker
	enc, trk = obj_helper.init_deepsort(max_cosine_distance, nn_budget)
	encoder = enc
	tracker = trk
	#region setup
	# load configuration for object detector
	config = ConfigProto()
	config.gpu_options.allow_growth = True
	video_path = FLAGS.video

	# load tflite model if flag is set
	global interpreter
	global input_details
	global output_details
	global infer
	if FLAGS.framework == 'tflite':
			interpreter = tf.lite.Interpreter(model_path=FLAGS.weights)
			interpreter.allocate_tensors()
			input_details = interpreter.get_input_details()
			output_details = interpreter.get_output_details()
	# otherwise load standard tensorflow saved model
	else:
			saved_model_loaded = tf.saved_model.load(FLAGS.weights, tags=[tag_constants.SERVING])
			infer = saved_model_loaded.signatures['serving_default']

	start_feed_listener()
	start_feed_listener()

	hoi = input('Press any key to continue...\n')

if __name__ == '__main__':
		try:
				app.run(main)
		except SystemExit:
				pass