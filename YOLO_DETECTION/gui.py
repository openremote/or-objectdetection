import wx
import cv2
import threading
import pickle

# calculation flags
calculateDirection = False
calculatePeopleCount = False
calculateTotalPeopleCount = False
calculateTheSpeed = False

# visual flags
visualizeBBoxes = False
visualizerCenters = False
calculateLineCross = False

videoSource = 0

# from tracker import *

def GetAvailableSource():
    index = 0
    arr = []
    while True:
        cap = cv2.VideoCapture(index)
        if not cap.read()[0]:
            break
        else:
            arr.append(str(index))
        cap.release()
        index += 1
    return arr

 # calculation flags
def CalculateDirection(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global calculateDirection
    if isChecked:
        calculateDirection = True
        print(calculateDirection)
    else:
        calculateDirection = False
        print(calculateDirection)

def CalculatePeopleCount(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global calculatePeopleCount
    if isChecked:
        calculatePeopleCount = True
        print(calculatePeopleCount)
    else:
        calculatePeopleCount = False
        print(calculatePeopleCount)

def CalculateTotalPeopleCount(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global calculateTotalPeopleCount
    if isChecked:
        calculateTotalPeopleCount = True
        print(calculateTotalPeopleCount)
    else:
        calculateTotalPeopleCount = False
        print(calculateTotalPeopleCount)

def CalculateTheSpeed(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global calculateTheSpeed
    if isChecked:
        calculateTheSpeed = True
        print(calculateTheSpeed)
    else:
        calculateTheSpeed = False
        print(calculateTheSpeed)

# visual flags
def VisualizeBBoxes(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global visualizeBBoxes
    if isChecked:
        visualizeBBoxes = True
        print(visualizeBBoxes)
    else:
        visualizeBBoxes = False
        print(visualizeBBoxes)

def VisualizerCenters(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global visualizerCenters
    if isChecked:
        visualizerCenters = True
        print(visualizerCenters)
    else:
        visualizerCenters = False
        print(visualizerCenters)

def CalculateLineCross(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    global calculateLineCross
    if isChecked:
        calculateLineCross = True
        print(calculateLineCross)
    else:
        calculateLineCross = False
        print(calculateLineCross)


class App(wx.Frame):
    def __init__(self, parent, title):
        super(App, self).__init__(parent, title=title)
        self.widgets()
        self.Show()
        self.SetSize(370,500)




    # Declare a function to add new buttons, icons, etc. to our app
    def widgets(self):
        pnl = wx.Panel(self)

        # Check box show direction
        cbCalculateDirection = wx.CheckBox(pnl, label='Show the direction', pos=(10, 0))
        cbCalculateDirection.SetValue(False)
        cbCalculateDirection.Bind(wx.EVT_CHECKBOX, CalculateDirection)

        # Check box Show people count
        cbShowCount = wx.CheckBox(pnl, label='Show number of people', pos=(10, 20))
        cbShowCount.SetValue(False)
        cbShowCount.Bind(wx.EVT_CHECKBOX, CalculatePeopleCount)

        # Check box Show people count
        cbCalculateTotalPeopleCount = wx.CheckBox(pnl, label='Show total number of people', pos=(10, 40))
        cbCalculateTotalPeopleCount.SetValue(False)
        cbCalculateTotalPeopleCount.Bind(wx.EVT_CHECKBOX, CalculateTotalPeopleCount)

        # Check box Show people count
        cbCalculateTheSpeed = wx.CheckBox(pnl, label='Show speed of the people', pos=(10, 60))
        cbCalculateTheSpeed.SetValue(False)
        cbCalculateTheSpeed.Bind(wx.EVT_CHECKBOX, CalculateTheSpeed)

        # Check box Show people count
        cbVisualizeBBoxes = wx.CheckBox(pnl, label='Draw boundary box ', pos=(10, 80))
        cbVisualizeBBoxes.SetValue(False)
        cbVisualizeBBoxes.Bind(wx.EVT_CHECKBOX, VisualizeBBoxes)

        # Check box Show people count
        cbVisualizerCenters = wx.CheckBox(pnl, label='Visualizer Centers', pos=(10, 100))
        cbVisualizerCenters.SetValue(False)
        cbVisualizerCenters.Bind(wx.EVT_CHECKBOX,  VisualizerCenters)

        cbCalculatePeopleOnly = wx.CheckBox(pnl, label='Calculate Line Cross', pos=(10, 120) )
        cbCalculatePeopleOnly.SetValue(False)
        cbCalculatePeopleOnly.Bind(wx.EVT_CHECKBOX, CalculateLineCross)

        # cbCalculateEverything = wx.CheckBox(pnl, label='Calculate everything', pos=(10, 140))
        # cbCalculateEverything.SetValue(False)
        # cbCalculateEverything.Bind(wx.EVT_CHECKBOX, CalculateEverything)

        # lbPeopleID = wx.StaticText(pnl, label='People IDs', pos=(10, 40))
        #
        # lstPeople = wx.ListBox(pnl, size=(300, -1), pos=(10, 60), choices=GetAvailableSource(), style=wx.LB_SINGLE)


        lblList = ['Default camera', 'External camera', 'Source camera']

        self.rbox = wx.RadioBox(pnl, label='Video Source', pos=(10, 170), choices=lblList,
                                majorDimension=1, style=wx.RA_SPECIFY_ROWS)
        self.rbox.Bind(wx.EVT_RADIOBOX, self.SetVal)

        self.basicText = wx.TextCtrl(pnl, -1, 'http://root:root@192.168.70.52/mjpg/1/video.mjpg', size=(300, -1), pos=(10, 230))

        self.labelDetection = wx.StaticText(pnl, label="Enter the detections", pos=(10, 260), style=0)

        self.basicTextt = wx.TextCtrl(pnl, -1, size=(300, -1), pos=(10, 280))
        closeButton = wx.Button(pnl, label='Start detection', pos=(10, 310))

        closeButton.Bind(wx.EVT_BUTTON, self.OnClose)

    def OnClose(self, e):
        parameterlist = []
        classlist = []
        classlist.append(self.basicTextt.GetValue().split(","))

        parameterlist.append(visualizeBBoxes)  # visualizeBBoxes
        parameterlist.append(visualizerCenters)  # visualizerCenters
        parameterlist.append(calculateDirection)  # calculateDirection
        parameterlist.append(calculateTheSpeed)  # calculateSpeed
        parameterlist.append(calculatePeopleCount)  # calculatePeopleCount
        parameterlist.append(calculateTotalPeopleCount)  # calculateTotalPeopleCount
        parameterlist.append(classlist)
        parameterlist.append(calculateLineCross)  # calculateLineCross
        
        stateVal = self.rbox.GetSelection()
	    print(classlist)
        global videoSource
        if stateVal == 2:
            videoSource = self.basicText.GetValue()
            print(videoSource)
        parameterlist.append(videoSource)
        with open('settings.data', 'wb') as filehandle:
            pickle.dump(parameterlist, filehandle)
        self.Close()

    def SetVal(self, event):
        state1 = self.rbox.GetSelection()
        global videoSource
        if state1 == 0:
            videoSource = 0
            print(videoSource)
        elif state1 == 1:
            videoSource = 1
            print(videoSource)


def main():
    myapp = wx.App()
    App(None, title='Object Detection Open Remote')
    myapp.MainLoop()

main()
