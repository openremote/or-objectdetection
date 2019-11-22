import cv2
from collections import deque
from itertools import islice
import numpy as np
import math

def getSpeed(pointList):
    dx = 0
    dy = 0

    for x in range(len(pointList)-1):
        dx += pointList[x+1][0] - pointList[x][0]  
        dy += pointList[x+1][1] - pointList[x][1] 

    speed = math.sqrt(abs(dx * dx - dy * dy))

    return round(speed / 100)

        

def getDirection(image, pointList):
    #width = image.shape[0]
    #height = image.shape[1]
    dx = 0
    dy = 0

    for x in range(len(pointList)-1):
        cv2.line(image, pointList[x], pointList[x+1], [0, 255, 0], 10)
        dx += pointList[x+1][0] - pointList[x][0]  
        dy += pointList[x+1][1] - pointList[x][1] 

    x = ""
    y = ""

    if(dx < 0):
        x = "right"

    if(dx > 0):
        x = "left"

    if(dy < 0):
        y = "down"

    if(dy > 0):
        y = "up"

    return (x,y)
    