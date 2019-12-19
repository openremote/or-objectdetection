import sys
from tracker import *
sys.path.append('/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION')
from api import *
import threading

parameterlist = []

def readParameters():
    parameterlist.append(True)                 #visualizeBBoxes
    parameterlist.append(True)             #visualizerCenters
    parameterlist.append(True)              #calculateDirection
    parameterlist.append(True)                #calculateSpeed
    parameterlist.append(True)           #calculatePeopleCount
    parameterlist.append(True)       #calculateTotalPeopleCount
    parameterlist.append(True)             #calculatePeopleOnly
    parameterlist.append(False)             #calculateEverything

 
readParameters()
yoloWorkerThread = threading.Thread(target=yoloWorker, args=(parameterlist,))

apiThread = threading.Thread(name='api', target=apiWorker)
apiThread.setDaemon(True)

apiThread.start()
yoloWorkerThread.start()
