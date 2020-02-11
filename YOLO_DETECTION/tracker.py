def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn


from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os, sys, time, datetime, random
from torch.autograd import Variable
from collections import deque
from PIL import Image
from analyse import *
from models import *
from utils import *
from sort import *
import torch
import json
import cv2

# load weights and set defaults
config_path='config/yolov3.cfg'
weights_path='config/yolov3.weights'
class_path='config/coco.names'
img_size=416
conf_thres=0.8
nms_thres=0.4

# load model and put into eval mode
model = Darknet(config_path, img_size=img_size)
model.load_weights(weights_path)
model.cuda()
model.eval()

classes = utils.load_classes(class_path)
Tensor = torch.cuda.FloatTensor

result = {}

def detect_image(img, classList):
    # scale and pad image
    ratio = min(img_size/img.size[0], img_size/img.size[1])
    imw = round(img.size[0] * ratio)
    imh = round(img.size[1] * ratio)
    img_transforms = transforms.Compose([ transforms.Resize((imh, imw)),
         transforms.Pad((max(int((imh-imw)/2),0), max(int((imw-imh)/2),0), max(int((imh-imw)/2),0), max(int((imw-imh)/2),0)),
                        (128,128,128)),
         transforms.ToTensor(),
         ])
    # convert image to Tensor
    image_tensor = img_transforms(img).float()
    image_tensor = image_tensor.unsqueeze_(0)
    input_img = Variable(image_tensor.type(Tensor))
    # run inference on the model and get detections
    with torch.no_grad():
        detections = model(input_img)
        detections = utils.non_max_suppression(detections, 80, conf_thres, nms_thres)
        
        realDetections = []
        
        #remove unwanted classes
        if detections is not None:
            for d in detections:
                if d is not None:
                    className = classes[int(d[0].cpu()[6])]
                    if className in classList:
                        realDetections.append(d)
        
        if len(realDetections):
            return realDetections[0]

    return None

def writeJson(peopleCountJson, totalPeopleCountJson, speedJson, directionxJson, directionyJson, totalLineCrossedLeftJson, totalLineCrossedRightJson, totalLineCrossedJson):
    global result 
    result = {'camera': "one",'people': int(peopleCountJson), 'totalpeople': int(totalPeopleCountJson), 'speed': int(speedJson), 'directionx': directionxJson, 'directiony': directionyJson, 'lineCrossedLeft': int(totalLineCrossedLeftJson), 'lineCrossedRight': int(totalLineCrossedRightJson), 'totalLineCrossed': int(totalLineCrossedJson)}

def getJson():
    return result

def yoloWorker(parameterlist):

    #visualParameters
    visualizeBBoxes = parameterlist[0]
    visualizerCenters = parameterlist[1]

    #calculationParameters
    calculateDirection = parameterlist[2]
    calculateSpeed = parameterlist[3]
    calculatePeopleCount = parameterlist[4]
    calculateTotalPeopleCount = parameterlist[5]
    classList = parameterlist[6]
    calculateLineCrossed = parameterlist[7]
    videoSource = parameterlist[8]

    print(classList)

    #videopath = '/home/openremote/Desktop/pytorch_objectdetecttrack-master/video.mp4'

    #setup 
    colors=[(255,0,0),(0,255,0),(0,0,255),(255,0,255),(128,0,0),(0,128,0),(0,0,128),(128,0,128),(128,128,0),(0,128,128)]

    if videoSource == "0" or videoSource == "1":
        vid = cv2.VideoCapture(int(videoSource))
    else:
        vid = cv2.VideoCapture(videoSource)

    mot_tracker = Sort() 

    pointsDict = {}
    TrackedIDs = []
    lineCrossingIDs = [] #list of ID's which are currantly crossing the line

    #parameters saved each frame
    prevPeopleCount = 0
    totalPeopleCount = 0

    totalLineCrossedLeft = 0
    totalLineCrossedRight = 0
    totalLineCrossed = 0

    frames = 0

    #START!
    while(True):

        peoplecount = 0
        
        ret, frame = vid.read()
        if not ret:
            break

        frames += 1
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pilimg = Image.fromarray(frame)
        detections = detect_image(pilimg, classList)

        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        img = np.array(pilimg)
        pad_x = max(img.shape[0] - img.shape[1], 0) * (img_size / max(img.shape))
        pad_y = max(img.shape[1] - img.shape[0], 0) * (img_size / max(img.shape))
        unpad_h = img_size - pad_y
        unpad_w = img_size - pad_x
        

        #total parameters
        totalSpeed = 0
        left = 0
        right = 0
        up = 0
        down = 0
        

        if detections is not None:
            tracked_objects = mot_tracker.update(detections.cpu())
            #unique_labels = detections[:, -1].cpu().unique()

            #currentlyTrackedId = []

            for x1, y1, x2, y2, obj_id, cls_pred in tracked_objects:
            
                speed = 0
                xdir = ""
                ydir = ""

                #get bounding box cordinates
                box_h = int(((y2 - y1) / unpad_h) * img.shape[0])
                box_w = int(((x2 - x1) / unpad_w) * img.shape[1])
                y1 = int(((y1 - pad_y // 2) / unpad_h) * img.shape[0])
                x1 = int(((x1 - pad_x // 2) / unpad_w) * img.shape[1])

                #calculate center of object
                center = (round(x1 + (box_w / 2)), round(y1 + (box_h / 2)))
                
                #get ID
                Id = int(obj_id)

                #if Id not in currentlyTrackedId:
                #    currentlyTrackedId.append(Id)

                if calculatePeopleCount:
                    peoplecount += 1 
                    if Id not in TrackedIDs:
                        TrackedIDs.append(Id)

                #add center to dict
                if Id in pointsDict:
                    pointsDict[Id].appendleft(center)

                else:
                    #if(len(pointsDict) > maxPointsDictLength):
                    #    del list(pointsDict)[0]
                    #    print("delete")
                    pointsDict[Id] = deque(maxlen=25)
                    pointsDict[Id].appendleft(center)

                if len(pointsDict[Id]) > 6:
                    if calculateDirection:
                        xdir, ydir = getDirection(frame, pointsDict[Id])
                        
                        if(xdir == "left"):
                            left += 1
                        if(xdir == "right"):
                            right += 1
                        if(ydir == "up"):
                            up += 1
                        if(ydir == "down"):
                            down += 1


                    if calculateSpeed:
                        speed = getSpeed(pointsDict[Id])
                        totalSpeed += speed

                    if(frames % 10 == 0):
                        if calculateLineCrossed:
                            lineCrossed = getCountLineCrossed(pointsDict[Id])
                            if lineCrossed != None:
                                if Id not in lineCrossingIDs:
                                    if lineCrossed == "left":
                                        totalLineCrossedLeft += 1
                                    elif lineCrossed == "right":
                                        totalLineCrossedRight += 1
                                    totalLineCrossed += 1
                                    lineCrossingIDs.append(Id)
                            else:
                                if Id in lineCrossingIDs:
                                    lineCrossingIDs.remove(Id)

                #visualize boxes
                if visualizeBBoxes:
                    color = colors[Id % len(colors)]
                    cls = classes[int(cls_pred)]
                    cv2.rectangle(frame, (x1, y1), (x1+box_w, y1+box_h), color, 4)
                    cv2.rectangle(frame, (x1, y1-105), (x1+len(cls)*19+80, y1), color, -1)
                    cv2.putText(frame, cls + "-" + str(Id), (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)
                    
                    if calculateDirection:
                        cv2.putText(frame, xdir  + " - " + ydir, (x1, y1 - 35), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)

                    if calculateSpeed:
                        cv2.putText(frame, "speed " + str(speed), (x1, y1 - 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)

                #visualize centers
                if visualizerCenters:
                    cv2.circle(frame, center, 5, (0, 0, 255), 5)
            
        # clean up unused Id's
        #if(frames % 90 == 0):
        #    idsToRemove = []
        #    for Id in pointsDict: 
        #        if Id not in currentlyTrackedId:
        #            idsToRemove.append(Id)
        #    for Id in idsToRemove:
        #        del pointsDict[Id]
        #visualize line
        if calculateLineCrossed:
            cv2.line(frame, (0,318), (637,221), [0, 255, 0], 10)
            cv2.putText(frame, "poeple count line crossed to left " + str(totalLineCrossedLeft), (0, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            
            cv2.putText(frame, "poeple count line crossed to right " + str(totalLineCrossedRight), (0, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            
            cv2.putText(frame, "poeple count line crossed Total " + str(totalLineCrossed), (0, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            
            
        # visualize People count
        if calculatePeopleCount:
            cv2.putText(frame, "people count " + str(peoplecount), (0, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            
       
        #get total people count
        if calculateTotalPeopleCount:
            #if peoplecount > prevPeopleCount:
            #    totalPeopleCount += abs(peoplecount - prevPeopleCount)
            #prevPeopleCount = peoplecount
            cv2.putText(frame, "total people count " + str(len(TrackedIDs)), (0, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            

        #get total direction
        if calculateDirection:
            totalxdir, totalydir = getTotalDirection(left,right,up,down)
            cv2.putText(frame, "Total Xdir " + totalxdir, (0, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)            
            cv2.putText(frame, "total Ydir " + totalydir, (0, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)   


        #get Average speed
        if peoplecount != 0:
            totalSpeed/peoplecount
        else:
            totalSpeed = 0

        #write json for API
        if(frames % 10 == 0):
            writeJson(peoplecount, len(TrackedIDs), totalSpeed, totalxdir, totalydir, totalLineCrossedLeft, totalLineCrossedRight, totalLineCrossed)

        #visualize
        #frame = cv2.resize(frame, (1920,1080))
        cv2.imshow('Stream', frame)
        ch = 0xFF & cv2.waitKey(1)
        if ch == 27:
            break

cv2.destroyAllWindows()
