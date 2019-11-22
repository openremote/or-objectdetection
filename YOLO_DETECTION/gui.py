import wx
import cv2


# direction
# people count
# and which video source
# and path length
# path length is an option the user can set


def ShowPeopleCount(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    if isChecked:
        print("True")
    else:
        print("False")


def ShowDirection(e):
    sender = e.GetEventObject()
    isChecked = sender.GetValue()

    if isChecked:
        print("True")
    else:
        print("False")


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


class app(wx.Frame):
    
    def __init__(self, parent, title):
        super(app, self).__init__(parent, title=title)
        self.widgets()
        self.Show()
        #self.SetIcon(wx.Icon(r"C:\Users\Redzhep\PycharmProjects\Camera_Detection_App\Capture.PNG"))

    # Declare a function to add new buttons, icons, etc. to our app
    def widgets(self):
        pnl = wx.Panel(self)

        # Check box show direction
        cbDirection = wx.CheckBox(pnl, label='Show the direction', pos=(10, 0))
        cbDirection.SetValue(True)
        cbDirection.Bind(wx.EVT_CHECKBOX, ShowDirection)

        # Check box Show people count
        cbShowCount = wx.CheckBox(pnl, label='Show number of people', pos=(10, 20))
        cbShowCount.SetValue(False)
        cbShowCount.Bind(wx.EVT_CHECKBOX, ShowPeopleCount)

        lbPeopleID = wx.StaticText(pnl, label='People IDs', pos=(10, 40))

        lstPeople = wx.ListBox(pnl, size=(300, -1), pos=(10, 60), choices=GetAvailableSource(), style=wx.LB_SINGLE)

        # Check box Build in Camera
        # rb1 = wx.RadioButton(pnl, 0, label='Default camera', pos=(10, 110), style=wx.RB_GROUP)
        # rb2 = wx.RadioButton(pnl, 1, label='External camera ', pos=(10, 130))
        # rb3 = wx.RadioButton(pnl, 3, label='Source camera', pos=(10, 150))
        # self.Bind(wx.EVT_RADIOBUTTON, self.OnRadiogroup)

        lblList = ['Default camera', 'External camera', 'Source camera']

        self.rbox = wx.RadioBox(pnl, label='Video Source', pos=(10, 110), choices=lblList,
                           majorDimension=1, style=wx.RA_SPECIFY_ROWS)
        self.rbox.Bind(wx.EVT_RADIOBOX, self.SetVal)

        self.basicText = wx.TextCtrl(pnl, -1, "URL", size=(175, -1), pos=(10, 170))


    def SetVal(self, event):
        state1 = self.rbox.GetSelection()
        if state1 == 0:
            print("1")
        elif state1 == 1:
            print("2")
        elif state1 == 2:
           print(self.basicText.GetValue())





def main():
    ui = wx.App()
    app(None, title='Object Detection Open Remote')
    ui.MainLoop()
    print("starting ui")

