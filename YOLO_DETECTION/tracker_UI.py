
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os, sys, time, datetime, random
from torch.autograd import Variable
from collections import deque
from PIL import Image
from analyse import *
from models import *
from utils import *
from gui import *
import torch

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
                    print(className)
                    if className == "person":
                        realDetections.append(d)
        
        if len(realDetections):
            #printprint(realDetections)
            return realDetections[0]

    return None

videopath = '/home/openremote/Desktop/pytorch_objectdetecttrack-master/video.mp4'

#init GUI
main()

import cv2
from sort import *
colors=[(255,0,0),(0,255,0),(0,0,255),(255,0,255),(128,0,0),(0,128,0),(0,0,128),(128,0,128),(128,128,0),(0,128,128)]

#vid = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')
vid = cv2.VideoCapture(0)
mot_tracker = Sort() 

cv2.namedWindow('Stream',cv2.WINDOW_NORMAL)
cv2.resizeWindow('Stream', (800,600))

pointsDict = {} #list with all ID's and tracked points 
ParametersDict = {} #list with all ID's and parameters from that ID  (ID): (direction(x,y), speed(int), )

#fourcc = cv2.VideoWriter_fourcc(*'XVID')
#ret,frame=vid.read()
#vw = frame.shape[1]
#vh = frame.shape[0]
#print ("Video size", vw,vh)
#outvideo = cv2.VideoWriter(videopath.replace(".mp4", "-det.mp4"),fourcc,20.0,(vw,vh))

frames = 0
starttime = time.time()
while(True):
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
    
    
    if detections is not None:
        tracked_objects = mot_tracker.update(detections.cpu())
        unique_labels = detections[:, -1].cpu().unique()
        n_cls_preds = len(unique_labels)
        
        for x1, y1, x2, y2, obj_id, cls_pred in tracked_objects:
            
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
                pointsDict[Id] = deque(maxlen=50)
                pointsDict[Id].appendleft(center)
            
            #calculate direction
            #if calculateDirection: 
            if len(pointsDict[Id]) > 5:
                (x,y) = getDirection(frame, pointsDict[Id])
                ParametersDict[Id] = ()
                    


            #visualize centers
            #if(visualizeCenters):
            #    cv2.circle(frame, center, 5, (0, 0, 255), 5)

            #visualize boxes
            #if(visualizeBBoxes):
            color = colors[Id % len(colors)]
            cls = classes[int(cls_pred)]
            cv2.rectangle(frame, (x1, y1), (x1+box_w, y1+box_h), color, 4)
            cv2.rectangle(frame, (x1, y1-35), (x1+len(cls)*19+80, y1), color, -1)
            cv2.putText(frame, cls + "-" + str(Id), (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 3)
            
                


    cv2.imshow('Stream', frame)
    #outvideo.write(frame)
    ch = 0xFF & cv2.waitKey(1)
    if ch == 27:
        break

totaltime = time.time()-starttime
#print(frames, "frames", totaltime/frames, "s/frame")
cv2.destroyAllWindows()
#outvideo.release()
