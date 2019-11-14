from centroidtracker import CentroidTracker
from trackableobject import TrackableObject
from collections import deque
from ctypes import *
import numpy as np
import darknet
import imutils
import random
import math
import time
import json
import dlib
import cv2
import os


netMain = None
metaMain = None
altNames = None

frame_width = None
frame_height = None



def convertBack(x, y, w, h):
    xmin = int(round(x - (w / 2)))
    xmax = int(round(x + (w / 2)))
    ymin = int(round(y - (h / 2)))
    ymax = int(round(y + (h / 2)))
    return xmin, ymin, xmax, ymax
    
def addTrackers(detections, image, trackers):

    for detection in detections:
        if(detection[0].decode() == "person" and detection[1] * 100 > 95):
            x = detection[2][0]
            y = detection[2][1]
            w = detection[2][2]
            h = detection[2][3]

            bbox = dlib.rectangle(int(x), int(y), int(x + w), int(y + h))

            xmin, ymin, xmax, ymax = convertBack(
                float(x), float(y), float(w), float(h))
            pt1 = (xmin, ymin)
            pt2 = (xmax, ymax)
            
            cv2.rectangle(image, pt1, pt2, (0, 255, 0), 1)

            tracker = dlib.correlation_tracker()
            tracker.start_track(image,bbox)

            trackers.append(tracker)
            print("add tracker")


def updateTrackers(image, trackers, bboxes):
    for tracker in trackers:

        tracker.update(image)
        position = tracker.get_position()

        startX = int(position.left())
        startY = int(position.top())
        endX = int(position.right())
        endY = int(position.bottom())

        bboxes.append((startX, startY, endX, endY))   
        print("update tracker")

def getTrackableObjects(image, trackableObjects, bboxes ,centroidTracker):
    
    print("get trackables")

    objects = centroidTracker.update(bboxes)

    for (objectID, centroid) in objects.items():
        to = trackableObjects.get(objectID, None)

        if to is None:
            to = TrackableObject(objectID, centroid)

        trackableObjects[objectID] = to

        text = "ID {}".format(objectID)
        cv2.putText(image, text, (centroid[0] - 10, centroid[1] - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        cv2.circle(image, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)

        



def main():

    #config
    frameDetectionSkip = 2

    global metaMain, netMain, altNames, frame_width, frame_height
    configPath = "/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION/cfg/yolov3.cfg"
    weightPath = "/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION/cfg/yolov3.weights"
    metaPath = "/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION/cfg/coco.data"
    if not os.path.exists(configPath):
        raise ValueError("Invalid config path `" +
                         os.path.abspath(configPath)+"`")
    if not os.path.exists(weightPath):
        raise ValueError("Invalid weight path `" +
                         os.path.abspath(weightPath)+"`")
    if not os.path.exists(metaPath):
        raise ValueError("Invalid data file path `" +
                         os.path.abspath(metaPath)+"`")
    if netMain is None:
        netMain = darknet.load_net_custom(configPath.encode(
            "ascii"), weightPath.encode("ascii"), 0, 1)  # batch size = 1
    if metaMain is None:
        metaMain = darknet.load_meta(metaPath.encode("ascii"))
    if altNames is None:
        try:
            with open(metaPath) as metaFH:
                metaContents = metaFH.read()
                import re
                match = re.search("names *= *(.*)$", metaContents,
                                  re.IGNORECASE | re.MULTILINE)
                if match:
                    result = match.group(1)
                else:
                    result = None
                try:
                    if os.path.exists(result):
                        with open(result) as namesFH:
                            namesList = namesFH.read().strip().split("\n")
                            altNames = [x.strip() for x in namesList]
                except TypeError:
                    pass
        except Exception:
            pass

    cap = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')
    cap.set(3, 1280)
    cap.set(4, 720)

    darknet_image = darknet.make_image(darknet.network_width(netMain),darknet.network_height(netMain),3)

    centroidTracker = CentroidTracker(maxDisappeared=40, maxDistance=50)
    trackableObjects = {}

    frameCount = 0

    #Main loop
    while True:

        bboxes = []
        trackers = [] 

        succes, frame_read = cap.read()

        if not succes:
            break
        
        frameCount += 1

        if frame_width is None or frame_height is None:
            (frame_height, frame_width) = darknet.network_height(netMain), darknet.network_width(netMain)


        prev_time = time.time() #for getting FPS

        frame_resized = cv2.resize(frame_read,(frame_width,frame_height),interpolation=cv2.INTER_LINEAR)



        #if(frameCount % frameDetectionSkip == 0):
        darknet.copy_image_from_bytes(darknet_image,frame_resized.tobytes())
        detections = darknet.detect_image(netMain, metaMain, darknet_image, thresh=0.25)

        addTrackers(detections,frame_resized, trackers)
        
        #else:
        updateTrackers(frame_resized, trackers, bboxes)

        getTrackableObjects(frame_resized, trackableObjects, bboxes, centroidTracker)

        #print(1/(time.time()-prev_time))
        cv2.imshow('Yolo', frame_resized)

        cv2.waitKey(3)
        
        frameCount += 1


    cap.release()
    #DataFile.close()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
