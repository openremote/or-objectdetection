import sys
from tracker import *
sys.path.append('/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION')
from api import *
import threading
import pickle

#text_file = open("settings.txt", "r")
#parameterlist = text_file.readlines()
parameterlist = []

with open('settings.data', 'rb') as filehandle:
    parameterlist = pickle.load(filehandle)

print(parameterlist)

yoloWorkerThread = threading.Thread(target=yoloWorker, args=(parameterlist,))

apiThread = threading.Thread(name='api', target=apiWorker)
apiThread.setDaemon(True)

apiThread.start()
yoloWorkerThread.start()
