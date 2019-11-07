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

#config
poepleCountON = True
poepleDirectionON = False

def convertBack(x, y, w, h):
    xmin = int(round(x - (w / 2)))
    xmax = int(round(x + (w / 2)))
    ymin = int(round(y - (h / 2)))
    ymax = int(round(y + (h / 2)))
    return xmin, ymin, xmax, ymax

def Analyse(detections, lastPeopleCount, centerPoints):
    
    debugScreen = np.zeros((512,512,3), np.uint8)
    peopleCount = 0

    for detection in detections:
        if(detection[0].decode() == "person"):
            #Person detected
            if(poepleCountON == True):
                peopleCount += 1

            
                
                #for newpoint in np.arange(1, len(centerPoints)):

                    #for oldpoint in np.arange(1, len(centerPoints)):

                        #oldpoint[]

    #write data to data file only if count has changed
        
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

    lastPeopleCount = 0

    global metaMain, netMain, altNames
    configPath = "/home/openremote/Desktop/darknet-master/cfg/yolov3.cfg"
    weightPath = "/home/openremote/Desktop/CameraDetectie/Example 3/yolo-object-detection/yolo-coco/yolov3.weights"
    metaPath = "/home/openremote/Desktop/darknet-master/cfg/coco.data"
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

        

    cap = cv2.VideoCapture(0)
    #cap = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')
    #cap = cv2.VideoCapture("/home/openremote/Desktop/CameraDetectie/videos/KruispuntBoven.mp4")
    cap.set(3, 1280)
    cap.set(4, 720)
     
    print("Starting the YOLO loop...")

    # Create an image we reuse for each detect
    darknet_image = darknet.make_image(darknet.network_width(netMain),darknet.network_height(netMain),3)


    while True:
        prev_time = time.time()
        ret, frame_read = cap.read()
        frame_rgb = cv2.cvtColor(frame_read, cv2.COLOR_BGR2RGB)
        frame_resized = cv2.resize(frame_rgb,
                                   (darknet.network_width(netMain),
                                    darknet.network_height(netMain)),
                                   interpolation=cv2.INTER_LINEAR)

        darknet.copy_image_from_bytes(darknet_image,frame_resized.tobytes())
        detections = darknet.detect_image(netMain, metaMain, darknet_image, thresh=0.25)
        image = cvDrawBoxesAndCenters(detections, frame_resized, centerPoints)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        analyseResults = Analyse(detections, lastPeopleCount, centerPoints)
        
        lastPeopleCount = analyseResults

        #print(1/(time.time()-prev_time))
        cv2.imshow('Yolo', image)
        cv2.waitKey(3)

    cap.release()
    out.release()
    DataFile.close()

if __name__ == "__main__":
    YOLO()
