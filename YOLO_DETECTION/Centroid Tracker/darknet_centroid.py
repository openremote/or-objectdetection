from ctypes import *
import math
import random
import os
import cv2
import numpy as np
import time
import darknet
from collections import deque
import imutils
import json
from centroidtracker import CentroidTracker
from trackableobject import TrackableObject
import dlib
import imutils
from imutils.video import VideoStream
from imutils.video import FPS

#config
poepleCountON = True
poepleDirectionON = False

def convertBack(x, y, w, h):
    xmin = int(round(x - (w / 2)))
    xmax = int(round(x + (w / 2)))
    ymin = int(round(y - (h / 2)))
    ymax = int(round(y + (h / 2)))
    return xmin, ymin, xmax, ymax

def Analyse(detections, lastPeopleCount, centerPoints, tracker):
    
    debugScreen = np.zeros((512,512,3), np.uint8)
    peopleCount = 0

    for detection in detections:
        if(detection[0].decode() == "person"):
            #Person detected
            if(poepleCountON == True):
                peopleCount += 1

       


        
    if(lastPeopleCount != peopleCount):
        result = {'camera': "one",'people': int(peopleCount)}
        with open('data.json', 'w') as outfile:
            json.dump(result, outfile)
        print("Update: " + str(peopleCount))

    lastPeopleCount = peopleCount
    cv2.putText(debugScreen, "People count: " + str(peopleCount),(10,100), cv2.FONT_HERSHEY_SIMPLEX, 1.5,(255,0,0),2 ,cv2.LINE_AA)
    cv2.imshow("Debug Screen", debugScreen)

    analyseResults = lastPeopleCount

    return analyseResults



def cvDrawBoxesAndCenters(detections, img, centerPoints):
 
    #centerList = []

    for detection in detections:
        if(detection[0].decode() == "person"):
            x, y, w, h = detection[2][0],\
                detection[2][1],\
                detection[2][2],\
                detection[2][3]
            xmin, ymin, xmax, ymax = convertBack(
                float(x), float(y), float(w), float(h))
            pt1 = (xmin, ymin)
            pt2 = (xmax, ymax)
            
            width = abs(pt2[0] - pt1[0])
            heigth = abs(pt2[1] - pt1[1])

            center = (round(pt1[0] + width / 2), round(pt1[1] + heigth / 2))

            cv2.circle(img, center, 5, (0, 0, 255), 5)
            
            #centerList.append(center)

            cv2.rectangle(img, pt1, pt2, (0, 255, 0), 1)
            cv2.putText(img,detection[0].decode() +" [" + str(round(detection[1] * 100, 2)) + "]",(pt1[0], pt1[1] - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, [0, 255, 0], 2)
   
    #centerPoints.append(centerList) 

   
    return img


netMain = None
metaMain = None
altNames = None


def YOLO():
    
    #Setup
    centerPoints = deque(maxlen=10)

    global metaMain, netMain, altNames
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

        

    #cap = cv2.VideoCapture(0)
    cap = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')
    #cap = cv2.VideoCapture("/home/openremote/Desktop/CameraDetectie/videos/KruispuntBoven.mp4")
    cap.set(3, 1280)
    cap.set(4, 720)


    #Init tracker 
    trackerType = "CSRT" 
    multiTracker = cv2.MultiTracker_create()
     
    print("Starting the YOLO loop...")

    # Create an image we reuse for each detect
    darknet_image = darknet.make_image(darknet.network_width(netMain),darknet.network_height(netMain),3)

    # initialize the frame dimensions (we'll set them as soon as we read
    # the first frame from the video)
    W = None
    H = None

    # instantiate our centroid tracker, then initialize a list to store
    # each of our dlib correlation trackers, followed by a dictionary to
    # map each unique object ID to a TrackableObject
    ct = CentroidTracker(maxDisappeared=40, maxDistance=50)
    trackers = []
    trackableObjects = {}


    # initialize the total number of frames processed thus far, along
    # with the total number of objects that have moved either up or down
    totalFrames = 0
    totalDown = 0
    totalUp = 0

    # start the frames per second throughput estimator
    fps = FPS().start()

    # start the frames per second throughput estimator

    while True:

        #peoplecount
        peopleCount = 0
        succes, frame_read = cap.read()

        prev_time = time.time()

        # resize the frame to have a maximum width of 500 pixels (the
        # less data we have, the faster we can process it), then convert
        # the frame from BGR to RGB for dlib
        frame_read = imutils.resize(frame_read, width=500)
        rgb = cv2.cvtColor(frame_read, cv2.COLOR_BGR2RGB)

        # if the frame dimensions are empty, set them
        if W is None or H is None:
            (H, W) = frame_read.shape[:2]

        frame_rgb = cv2.cvtColor(frame_read, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb,
                                   (darknet.network_width(netMain),
                                    darknet.network_height(netMain)),
                                   interpolation=cv2.INTER_LINEAR)

        # initialize the current status along with our list of bounding
        # box rectangles returned by either (1) our object detector or
        # (2) the correlation trackers
        rects = []

		# set the status and initialize our new set of object trackers
        trackers = []  

        darknet.copy_image_from_bytes(darknet_image,frame_resized.tobytes())
        detections = darknet.detect_image(netMain, metaMain, darknet_image, thresh=0.25)
        
        image = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)

        peopleCount = 0
        for detection in detections:
            if(detection[0].decode() == "person" and detection[1] * 100 > 95):
                # extract the index of the class label from the
                # detections list

                # compute the (x, y)-coordinates of the bounding box
                # for the object
                x = detection[2][0]
                y = detection[2][1]
                w = detection[2][2]
                h = detection[2][3]

                startX = int(x)
                startY = int(y)
                endX = int(x + w)
                endY = int(y + h)

                # construct a dlib rectangle object from the bounding
                # box coordinates and then start the dlib correlation
                # tracker
                tracker = dlib.correlation_tracker()
                rect = dlib.rectangle(startX, startY, endX, endY)
                tracker.start_track(rgb, rect)

                # add the tracker to our list of trackers so we can
                # utilize it during skip frames
                trackers.append(tracker)

        # loop over the trackers
        for tracker in trackers:
            # set the status of our system to be 'tracking' rather
            # than 'waiting' or 'detecting'

            # update the tracker and grab the updated position
            tracker.update(rgb)
            pos = tracker.get_position()

            # unpack the position object
            startX = int(pos.left())
            startY = int(pos.top())
            endX = int(pos.right())
            endY = int(pos.bottom())

            # add the bounding box coordinates to the rectangles list
            rects.append((startX, startY, endX, endY))

        # draw a horizontal line in the center of the frame -- once an
        # object crosses this line we will determine whether they were
        # moving 'up' or 'down'
        #cv2.line(image, (0, H // 2), (W, H // 2), (0, 255, 255), 2)

        # use the centroid tracker to associate the (1) old object
        # centroids with (2) the newly computed object centroids
        objects = ct.update(rects)

        # loop over the tracked objects
        for (objectID, centroid) in objects.items():
            # check to see if a trackable object exists for the current
            # object ID
            to = trackableObjects.get(objectID, None)

            # if there is no existing trackable object, create one
            if to is None:
                to = TrackableObject(objectID, centroid)

            # otherwise, there is a trackable object so we can utilize it
            # to determine direction
            else:
                peopleCount + 1

            # store the trackable object in our dictionary
            trackableObjects[objectID] = to

            # draw both the ID of the object and the centroid of the
            # object on the output frame
            text = "ID {}".format(objectID)
            cv2.putText(image, text, (centroid[0] - 10, centroid[1] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            cv2.circle(image, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)

        # construct a tuple of information we will be displaying on the
        # frame
        info = [
            ("Up", totalUp),
            ("Down", totalDown),
        ]

        # loop over the info tuples and draw them on our frame
        for (i, (k, v)) in enumerate(info):
            text = "{}: {}".format(k, v)
            cv2.putText(image, text, (10, H - ((i * 20) + 20)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)


        #image = cvDrawBoxesAndCenters(detections, frame_resized, centerPoints)
        #analyseResults = Analyse(detections, lastPeopleCount, centerPoints, CSRT_tracker)
        #lastPeopleCount = analyseResults
        print(1/(time.time()-prev_time))
        cv2.imshow('Yolo', image)
        
        cv2.waitKey(3)

        cv2.putText(image,str(peopleCount),(10,30), cv2.FONT_HERSHEY_COMPLEX, 1,(255,0,0),2,cv2.LINE_AA)

        # increment the total number of frames processed thus far and
        # then update the FPS counter
        totalFrames += 1
        fps.update()

    fps.stop()
    print("[INFO] elapsed time: {:.2f}".format(fps.elapsed()))
    print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))

    cap.release()
    out.release()
    DataFile.close()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    YOLO()
