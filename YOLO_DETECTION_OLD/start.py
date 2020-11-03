from tracker import *
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
