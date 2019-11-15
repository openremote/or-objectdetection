import cv2
from collections import deque
from itertools import islice
import numpy as np

def getSpeed(PointList):
    return PointList

def getDirection(image, pointList):
    width = image.shape[0]
    height = image.shape[1]
    dx = 0
    dy = 0
    
    print(pointList)

    for x in range(len(pointList)-1):
        cv2.line(image, pointList[x], pointList[x+1], [0, 255, 0], 10)
        dx += pointList[x+1][0] - pointList[x][0]  
        dy += pointList[x+1][1] - pointList[x][1] 

    if(dx < 0):
        print("right")

    if(dx > 0):
        print("left")

    if(dy < 0):
        print("down")

    if(dy > 0):
        print("up")
    