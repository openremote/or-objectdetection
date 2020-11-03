

import cv2
from collections import deque
from itertools import islice
import numpy as np
import math

def getCountLineCrossed(pointList):

    a = (0,318)
    b = (637,221)
    
    position = ((b[0] - a[0])*(pointList[0][1] - a[1]) - (b[1] - a[1])*(pointList[0][0] - a[0]))
    prevposition = ((b[0] - a[0])*(pointList[0 - 5][1] - a[1]) - (b[1] - a[1])*(pointList[0 - 5][0] - a[0]))

    if(prevposition != 0 and position != 0):
        if(position > 0 and prevposition < 0):
            print("crossed to right")
            return "right"
        if(position < 0 and prevposition > 0):
            print("crossed to left")
            return "left"
    return None

    

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
    
def getTotalDirection(left, right, up, down):
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

    return (totalxdir,totalydir)
