import wx
import cv2
import numpy as np
import os

from wx.lib.masked import NumCtrl
"""
requires wx, cv2, and numpy to run. the frozen exe is ~36MB
Help was obtained from the following urls:
http://stackoverflow.com/questions/14804741/opencv-integration-with-wxpython
http://stackoverflow.com/questions/24856687/wxpython-button-widget-wont-move
"""

current_directory = ''
iteration = 1
mirror = True
width, height = (1920,1080)

class webcamPanel(wx.Panel):
	
	def __init__(self, parent, camera, fps=10):
		global mirror
		
		wx.Panel.__init__(self, parent)
		
		self.camera = camera
		return_value, frame = self.camera.read()
		height, width = frame.shape[:2]
		
		frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		if mirror:
			frame = cv2.flip(frame, 1)
		self.bmp = wx.BitmapFromBuffer(width, height, frame)
		
		
		self.SetSize((width,height))
		
		self.timer = wx.Timer(self)
		self.timer.Start(1000./fps)
		
		self.Bind(wx.EVT_PAINT, self.OnPaint)
		self.Bind(wx.EVT_TIMER, self.NextFrame)
		
	def OnPaint(self, e):
		dc = wx.BufferedPaintDC(self)
		dc.DrawBitmap(self.bmp, 0, 0)
		
	def NextFrame(self, e):
		return_value, frame = self.camera.read()
		if return_value:
			frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
			if mirror:
				frame = cv2.flip(frame, 1)
			self.bmp.CopyFromBuffer(frame)
			self.Refresh()
			
class mainWindow(wx.Frame):
	def __init__(self, camera):
		
		#set up directory to save photos
		global current_directory
		current_directory = os.getcwd()
		
		#inheritence
		wx.Frame.__init__(self, None, style=wx.MINIMIZE_BOX | wx.MAXIMIZE_BOX | wx.SYSTEM_MENU | wx.CAPTION | wx.CLOSE_BOX | wx.CLIP_CHILDREN)
		self.Title = "webcam"
		#menubar
		menubar = wx.MenuBar()
		
		filemenu = wx.Menu()
		change_dir = filemenu.Append(-1, 'Change Directory', "Change the directory to save Photos")
		menubar.Append(filemenu, '&File')
		
		optionsmenu = wx.Menu()
		self.mirrorcheckbox = optionsmenu.AppendCheckItem(-1, 'Mirror Image', "Mirror")
		optionsmenu.Check(self.mirrorcheckbox.GetId(), True)
		resolutionsmenu = wx.Menu()
		self.sixforty = resolutionsmenu.AppendRadioItem(-1, '640x480', "640x480")
		self.ninteentwenty = resolutionsmenu.AppendRadioItem(-1, '1920x1080', "1920x1080")
		self.custom = resolutionsmenu.AppendRadioItem(-1, 'Custom', "Custom")
		resolutionsmenu.Check(self.ninteentwenty.GetId(), True)
		optionsmenu.AppendMenu(wx.ID_ANY, '&Resolutions', resolutionsmenu)
		menubar.Append(optionsmenu,'&Options')
		
		self.SetMenuBar(menubar)
		
		
		#main ui
		self.webcampanel = webcamPanel(self, camera)
		self.button = wx.Button(self, label="Take Picture!")
		
		main_window_sizer = wx.BoxSizer(wx.VERTICAL)
		
		main_window_sizer.Add(self.webcampanel, 7, wx.CENTER | wx.BOTTOM | wx.EXPAND, 1)
		main_window_sizer.SetItemMinSize(self.webcampanel, (1200,900))
		main_window_sizer.Add(self.button, 1, wx.CENTER | wx.EXPAND)
		
		self.SetSizer(main_window_sizer)
		main_window_sizer.Fit(self)
		
		self.Bind(wx.EVT_MENU, self.change_dir, change_dir)
		self.Bind(wx.EVT_MENU, self.mirror, self.mirrorcheckbox)
		self.Bind(wx.EVT_MENU, self.resolution, self.sixforty)
		self.Bind(wx.EVT_MENU, self.resolution, self.ninteentwenty)
		self.Bind(wx.EVT_MENU, self.custom_resolution, self.custom)
		self.Bind(wx.EVT_BUTTON, self.take_picture, self.button)
        self.cbCalculateDirection = wx.CheckBox(self, Label='Show the direction')


	def change_dir(self, e):
		#declare global variables
		global current_directory
		global iteration
		#open the choose folder directory
		dialog = wx.DirDialog(None, "Choose a directory:",style=wx.DD_DEFAULT_STYLE | wx.DD_NEW_DIR_BUTTON)
		#wait for the okay
		if dialog.ShowModal() == wx.ID_OK:
			#grab the new directory
			current_directory = dialog.GetPath()
		#close the window
		dialog.Destroy()
		#reset the count for files
		iteration = 1

	def mirror(self, e):
		global mirror
		mirror = self.mirrorcheckbox.IsChecked()
			
	def resolution(self, e):
		global width
		global height
		
		if self.sixforty.IsChecked() == True:
			width = 640
			height = 480
		elif self.ninteentwenty.IsChecked() == True:
			width = 1920
			height = 1080
	
	def custom_resolution(self, e):
		
		global width
		global height
		
		dlg = wx.Dialog(self, size = (300,150))
		self.instructions = wx.StaticText(dlg, wx.ID_ANY, 'Here you can input a custom resolution. Make sure your camera supports it.')
		
		self.width = NumCtrl(dlg)
		self.width.SetAllowNegative(False)
		self.width.SetAllowNone(False)
		self.width.SetValue(width)
		self.placex = wx.StaticText(dlg, wx.ID_ANY, 'x')
		self.height = NumCtrl(dlg)
		self.height.SetAllowNegative(False)
		self.height.SetAllowNone(False)
		self.height.SetValue(height)
		
		self.enter = wx.Button(dlg, wx.ID_OK)
		self.cancel = wx.Button(dlg, wx.ID_CANCEL)
		
		wrap_sizer = wx.BoxSizer(wx.VERTICAL)
		instructions_sizer = wx.BoxSizer(wx.HORIZONTAL)
		button_sizer = wx.BoxSizer(wx.HORIZONTAL)
		
		button_sizer.Add(self.enter, 0, wx.CENTER | wx.RIGHT, 5)
		button_sizer.Add(self.cancel, 0, wx.CENTER)
		instructions_sizer.Add(self.width, 1, wx.CENTER | wx.EXPAND)
		instructions_sizer.Add(self.placex, 0, wx.CENTER)
		instructions_sizer.Add(self.height, 1, wx.CENTER | wx.EXPAND)
		wrap_sizer.Add(self.instructions, 1, wx.CENTER | wx.LEFT | wx.RIGHT | wx.BOTTOM, 10)
		wrap_sizer.Add(instructions_sizer, 0, wx.CENTER | wx.EXPAND | wx.ALL, 10)
		wrap_sizer.Add(button_sizer, 0, wx.CENTER | wx.BOTTOM, 10)
		
		dlg.SetSizer(wrap_sizer)
		dlg.Centre()
		dlg.Show()
		
		if dlg.ShowModal() == wx.ID_OK:
			height = self.height.GetValue()
			width = self.width.GetValue()
		
	def take_picture(self, e):
		#declare global variables
		global current_directory
		global iteration
		global mirror
		global height
		global width
		
		#get current frame from camera
		camera.set(3,width)
		camera.set(4,height)
		
		return_value, image = camera.read()
		#check to see if you should mirror image
		if mirror:
			image = cv2.flip(image, 1)
		#get the directory to save it in.
		filename = current_directory + "/000" + str(iteration) + ".png"
		#update the count
		iteration += 1
		#save the image
		cv2.imwrite(filename,image)
		#read the image (this is backwards isn't it?!
		saved_image = cv2.imread(filename)
		
		if height > 500:
			multiplyer = float(500.0 / height)
			multiplyer = round(multiplyer, 3)
			height *= multiplyer
			height = int(height)
			width *= multiplyer
			width = int(width)
		
		saved_image = cv2.resize(saved_image, (width,height))
		#show the image in a new window!
		cv2.imshow('Snapshot!',saved_image)
		camera.set(3, 640)
		camera.set(4,480)
		
		

camera = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')

app = wx.App()
window = mainWindow(camera)
window.Show()
app.MainLoop()