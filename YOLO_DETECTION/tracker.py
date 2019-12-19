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

def detect_image(img):
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
        #print(classes[int(detections.cpu()[0][6])])
        if detections is not None:
            for d in detections:
                if d is not None:
                    className = classes[int(d[0].cpu()[6])]
                    if className == "person":
                        realDetections.append(d)
        
        if len(realDetections):
            #printprint(realDetections)
            return realDetections[0]

    return None

def writeJson(peopleCountJson, totalPeopleCountJson, speedJson, directionxJson, directionyJson):
    global result 
    result = {'camera': "one",'people': int(peopleCountJson), 'totalpeople': int(totalPeopleCountJson), 'speed': int(speedJson), 'directionx': directionxJson, 'directiony': directionyJson}

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
    calculatePeopleOnly = parameterlist[6]
    calculateEverything = parameterlist[7]
    #videoSource = parameterlist[8]

    #videopath = '/home/openremote/Desktop/pytorch_objectdetecttrack-master/video.mp4'
    colors=[(255,0,0),(0,255,0),(0,0,255),(255,0,255),(128,0,0),(0,128,0),(0,0,128),(128,0,128),(128,128,0),(0,128,128)]
    vid = cv2.VideoCapture(0)
    #vid = cv2.VideoCapture(videopath)
    mot_tracker = Sort() 

    cv2.namedWindow('Stream',cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Stream', (800,600))

    pointsDict = {}
    ParametersDict = {} #list with all ID's and parameters from that ID  (ID): (direction(x,y), speed(int), )

    prevPeopleCount = 0
    totalPeopleCount = 0

    totalLineCrossed = 0
    LineCrossedLeft = 0
    LineCrossedRight = 0

    frames = 0

    while(True):

        peoplecount = 0
        ret, frame = vid.read()
        if not ret:
            break
        frames += 1
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pilimg = Image.fromarray(frame)
        detections = detect_image(pilimg)

        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        img = np.array(pilimg)
        pad_x = max(img.shape[0] - img.shape[1], 0) * (img_size / max(img.shape))
        pad_y = max(img.shape[1] - img.shape[0], 0) * (img_size / max(img.shape))
        unpad_h = img_size - pad_y
        unpad_w = img_size - pad_x
        
        speed = 0
        xdir = ""
        ydir = ""

        totalSpeed = 0
        
       
        left = 0
        right = 0
        up = 0
        down = 0
        
        if detections is not None:
            tracked_objects = mot_tracker.update(detections.cpu())
            unique_labels = detections[:, -1].cpu().unique()
            #n_cls_preds = len(unique_labels)
            
            for x1, y1, x2, y2, obj_id, cls_pred in tracked_objects:
            
                if classes[int(cls_pred)] == "person":

                    if calculatePeopleCount:
                        peoplecount += 1

                    #get bounding box cordinates
                    box_h = int(((y2 - y1) / unpad_h) * img.shape[0])
                    box_w = int(((x2 - x1) / unpad_w) * img.shape[1])
                    y1 = int(((y1 - pad_y // 2) / unpad_h) * img.shape[0])
                    x1 = int(((x1 - pad_x // 2) / unpad_w) * img.shape[1])

                    #calculate center of object
                    
                    center = (round(x1 + (box_w / 2)), round(y1 + (box_h / 2)))
                    
                    Id = int(obj_id)

                    #add center to dict
                    if Id in pointsDict:
                        pointsDict[Id].appendleft(center)

                    else:
                        pointsDict[Id] = deque(maxlen=25)
                        pointsDict[Id].appendleft(center)
                    
                    if len(pointsDict[Id]) > 5:
                        

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
                        
                        #lineCrossed = getCountLineCrossed(frame, pointsDict[Id])
                        #if lineCrossed != None:
                        #    if lineCrossed == "left":
                        #        LineCrossedLeft += 1
                        #    elif lineCrossed == "right":
                        #        LineCrossedRight += 1
                        #    totalLineCrossed += 1



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

        #visualize line
        #cv2.line(frame, (1,333), (648,333), [0, 255, 0], 10)
        #cv2.putText(frame, "poeple count line crossed to left " + str(LineCrossedLeft), (0, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)            
        #cv2.putText(frame, "poeple count line crossed to right " + str(LineCrossedRight), (0, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)            
        #cv2.putText(frame, "poeple count line crossed Total " + str(totalLineCrossed), (0, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)            
        
        

        # visualize People count
        if calculatePeopleCount:
            cv2.putText(frame, "people count " + str(peoplecount), (0, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)            
       

        if calculateTotalPeopleCount:
            if peoplecount > prevPeopleCount:
                totalPeopleCount += abs(peoplecount - prevPeopleCount)
            prevPeopleCount = peoplecount
            cv2.putText(frame, "total people count " + str(totalPeopleCount), (0, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)            
                            
        totalxdir = ""
        totalydir = ""

        if(left > right):
            totalxdir = "left"
        elif(left < right):
            totalxdir = "right"
        else:
            totalxdir = "unavailable"
        
        if(up > down):
            totalydir = "up"
        elif(up < down):
            totalydir = "down"
        else:
            totalydir = "unavailable"

        if peoplecount != 0:
            totalSpeed/peoplecount
        else:
            totalSpeed = 0

        if(frames % 30 == 0):
            writeJson(peoplecount, totalPeopleCount, totalSpeed, totalxdir, totalydir)

        
        cv2.imshow('Stream', frame)
        #outvideo.write(frame)
        ch = 0xFF & cv2.waitKey(1)
        if ch == 27:
            break

cv2.destroyAllWindows()
