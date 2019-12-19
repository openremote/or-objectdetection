from tracker import *

parameterlist = []

parameterlist.append(True)                 #visualizeBBoxes
parameterlist.append(True)             #visualizerCenters
parameterlist.append(True)              #calculateDirection
parameterlist.append(True)                #calculateSpeed
parameterlist.append(True)           #calculatePeopleCount
parameterlist.append(True)       #calculateTotalPeopleCount
parameterlist.append(True)             #calculatePeopleOnly
parameterlist.append(False)             #calculateEverything

startYolo(parameterlist)