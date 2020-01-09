# OpenRemote Object Tracking
Open source implementation of an object tracking algorithm that takes an input of a video source and calculates different parameters from the objects in the frame (people, bikes, cars) then displays the parameters (number of objects, average speed, direction of moving) and sends them to be displayed on the Open Remote manager throw an HTTP API in a Json format.


# Installation
- Install CUDA
- Install Python3
- Install OpenCV 
- Install NodeJS

# Run
- Run "python3 YOLO_DETECTION/darknet_video.py" (Make sure the right video source is selected in darknet_video.py)
- Run "nodejs API/app2.js"
- Add new atribute in the manager with IP of the computer where the API is running on.

It should now work.

THIS REPO IS WORK IN PROGRESS. THERE ARE BUGS! A DETAILED INSTRUCTIONS WILL COME LATER.


