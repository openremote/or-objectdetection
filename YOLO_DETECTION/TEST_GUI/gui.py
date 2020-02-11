# import system module
import sys
import pickle
# import some PyQt5 modules
from PyQt5.QtWidgets import QApplication
from PyQt5.QtWidgets import QWidget
from PyQt5.QtGui import QImage, QIcon
from PyQt5.QtGui import QPixmap, QPainter, QPen
from PyQt5.QtCore import QTimer

import sys
#sys.path.append('/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION')
#from start import *

# import Opencv module
import cv2

from ui_main_window import *

# calculation flags
calculateDirection = False
calculatePeopleCount = False
calculateTotalPeopleCount = False
calculateTheSpeed = False

# visual flags
visualizeBBoxes = False
visualizerCenters = False
calculatePeopleOnly = False
calculateEverything = False
calculateLineCross = False
videoSource = 0
sourceCamera = False


class MainWindow(QWidget):
    # class constructor
    def __init__(self):
        # call QWidget constructor
        super().__init__()
        self.ui = Ui_Form()
        self.ui.setupUi(self)
        pixmap = QPixmap('./or_logo.png')
        pixmap4 = pixmap.scaled(561, 61, QtCore.Qt.KeepAspectRatio)
        self.ui.image_label_2.setPixmap(pixmap4)
        self.ui.cbDirection.stateChanged.connect(self.showDirection)
        self.ui.cbNmPeople.stateChanged.connect(self.showNumOfPeople)
        self.ui.cbTotalNmPeople.stateChanged.connect(self.showTotalNumPeople)
        self.ui.cbSpeedPeople.stateChanged.connect(self.showSpeed)
        self.ui.cbBoundaryBox.stateChanged.connect(self.showBoundaryBox)
        self.ui.cbLineCros.stateChanged.connect(self.showLineCrose)
        self.ui.cbVisualCenters.stateChanged.connect(self.showCenters)
        self.ui.rbDefault.toggled.connect(
            lambda: self.btnstate(self.ui.rbDefault))
        self.ui.rbExternal.toggled.connect(
            lambda: self.btnstate(self.ui.rbExternal))
        self.ui.rbSorce.toggled.connect(lambda: self.btnstate(self.ui.rbSorce))
        self.ui.btStartDetection.clicked.connect(self.OnClose)

        # create a timer
        self.timer = QTimer()
        # set timer timeout callback function
        self.timer.timeout.connect(self.viewCam)
        # set control_bt callback clicked  function
        self.ui.btShowVideoSource.clicked.connect(self.controlTimer)

    # view camera

    def viewCam(self):
        # read image in BGR format
        ret, image = self.cap.read()
        # convert image to RGB format
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (1200, 720))
        # image = cv2.line(image, (0, 0), (600, 600), (255, 0, 0), 5)
        # get image infos
        height, width, channel = image.shape
        step = channel * width
        # create QImage from image
        qImg = QImage(image.data, width, height, step, QImage.Format_RGB888)
        # show image in img_label
        self.ui.image_label.setPixmap(QPixmap.fromImage(qImg))

    # start/stop timer
    def controlTimer(self):
        # if timer is stopped
        if not self.timer.isActive():
            # create video capture
           
            self.cap = cv2.VideoCapture(videoSource)
            # start timer
            self.timer.start(20)
            # update control_bt text
            self.ui.btShowVideoSource.setText("Stop")
        # if timer is started
        else:
            # stop timer
            self.timer.stop()
            # release video capture
            self.cap.release()
            # update control_bt text
            self.ui.btShowVideoSource.setText("Start")

    def showDirection(self, state):
        global calculateDirection
        if state == QtCore.Qt.Checked:
            calculateDirection = True
        else:
            calculateDirection = False

    def showNumOfPeople(self, state):
        global calculatePeopleCount
        if state == QtCore.Qt.Checked:
            calculatePeopleCount = True
        else:
            calculatePeopleCount = False

    def showTotalNumPeople(self, state):
        global calculateTotalPeopleCount
        if state == QtCore.Qt.Checked:
            calculateTotalPeopleCount = True
        else:
            calculateTotalPeopleCount = False

    def showSpeed(self, state):
        global calculateTheSpeed
        if state == QtCore.Qt.Checked:
            calculateTheSpeed = True
        else:
            calculateTheSpeed = False

    def showBoundaryBox(self, state):
        global visualizeBBoxes
        if state == QtCore.Qt.Checked:
            visualizeBBoxes = True
        else:
            visualizeBBoxes = False

    def showCenters(self, state):
        global visualizerCenters 
        if state == QtCore.Qt.Checked:
            visualizerCenters = True
        else:
            visualizerCenters = False

    def showLineCrose(self, state):
        global calculateLineCross
        if state == QtCore.Qt.Checked:
            calculateLineCross = True
        else:
            calculateLineCross = False

    def btnstate(self, b):
        global videoSource
        if b.text() == "Default camera":
            if b.isChecked() == True:
                self.ui.tbVidepSorce.setDisabled(True)
                videoSource = 0
            else:
                self.ui.tbVidepSorce.setDisabled(False)

        if b.text() == "External camera":
            if b.isChecked() == True:
                self.ui.tbVidepSorce.setDisabled(True)
                videoSource = 1
            else:
                self.ui.tbVidepSorce.setDisabled(False)
        if b.text() == "Source camera":
            if b.isChecked() == True:
                self.ui.tbVidepSorce.setDisabled(False)
                videoSource = self.ui.tbVidepSorce.text()
                sourceCamera = True
            else:
                self.ui.tbVidepSorce.setDisabled(True)
                sourceCamera = False

    def OnClose(self, e):
        global videoSource
        parameterlist = []
        classlist = []
        classlist = self.ui.tbClassDetect.text().split(",")
        print(classlist)
        parameterlist.append(visualizeBBoxes)  # visualizeBBoxes
        parameterlist.append(visualizerCenters)  # visualizerCenters
        parameterlist.append(calculateDirection)  # calculateDirection
        parameterlist.append(calculateTheSpeed)  # calculateSpeed
        parameterlist.append(calculatePeopleCount)  # calculatePeopleCount
        # calculateTotalPeopleCount
        parameterlist.append(calculateTotalPeopleCount)
        parameterlist.append(classlist)
        parameterlist.append(calculateLineCross)  # calculateLineCross

        if(sourceCamera == True):
            videoSource = self.ui.tbVidepSorce.text()

        parameterlist.append(videoSource)

        with open('/home/openremote/Desktop/or-objectdetection/YOLO_DETECTION/settings.data', 'wb') as filehandle:
            pickle.dump(parameterlist, filehandle)
        self.ui.terminate()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    # create and show mainWindow
    app.setWindowIcon(QIcon('./logo.png'))
    mainWindow = MainWindow()
    mainWindow.show()
    sys.exit(app.exec_())
