import numpy as np
import matplotlib.pyplot as plt
import cv2
# deep sort imports
from deep_sort import preprocessing, nn_matching
from deep_sort.detection import Detection
from deep_sort.tracker import Tracker
from tools import generate_detections as gdet

def init_deepsort(max_cosine_distance, nn_budget):
	model_filename = 'model_data/mars-small128.pb'
	encoder = gdet.create_box_encoder(model_filename, batch_size=1)
	# calculate cosine distance metric
	metric = nn_matching.NearestNeighborDistanceMetric("cosine", max_cosine_distance, nn_budget)
	# initialize tracker
	tracker = Tracker(metric)
	return encoder, tracker

def transform_detections_to_deepsort(bboxes, scores, names, features):
	return [Detection(bbox, score, class_name, feature) for bbox, score, class_name, feature in zip(bboxes, scores, names, features)]


def apply_deepsort(encoder, tracker, frame, bboxes, scores, names, nms_max_overlap):
	# encode yolo detections and feed to tracker
	features = encoder(frame, bboxes)
	detections = transform_detections_to_deepsort(bboxes,scores,names,features)

	#initialize color map
	cmap = plt.get_cmap('tab20b')
	colors = [cmap(i)[:3] for i in np.linspace(0, 1, 20)]

	# run non-maxima supression
	boxs = np.array([d.tlwh for d in detections])
	scores = np.array([d.confidence for d in detections])
	classes = np.array([d.class_name for d in detections])
	indices = preprocessing.non_max_suppression(boxs, classes, nms_max_overlap, scores)
	detections = [detections[i] for i in indices]       

	# Call the tracker
	tracker.predict()
	tracker.update(detections)

	# update tracks
	for track in tracker.tracks:
			if not track.is_confirmed() or track.time_since_update > 1:
					continue 
			bbox = track.to_tlbr()
			class_name = track.get_class() 
	# draw bbox on screen
			color = colors[int(track.track_id) % len(colors)]
			color = [i * 255 for i in color]
			cv2.rectangle(frame, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), color, 2)
			cv2.rectangle(frame, (int(bbox[0]), int(bbox[1]-30)), (int(bbox[0])+(len(class_name)+len(str(track.track_id)))*17, int(bbox[1])), color, -1)
			cv2.putText(frame, class_name + "-" + str(track.track_id),(int(bbox[0]), int(bbox[1]-10)),0, 0.75, (255,255,255),2)

	result = np.asarray(frame)
	result = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
	return result