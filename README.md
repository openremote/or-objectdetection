# OpenRemote Object Tracking
Open source implementation of an object tracking algorithm that takes an input of a video source and calculates different parameters from the objects in the frame (people, bikes, cars) then displays the parameters (number of objects, average speed, direction of moving) and sends them to be displayed on the Open Remote manager throw an HTTP API in a Json format.

![Image description](https://github.com/openremote/or-objectdetection/blob/master/YOLO_DETECTION/demoPicture.png)

# Installation
- Install CUDA
- Install Python3
- Install OpenCV
- Install pyQT
- Install pyTorch
- Install torchVision


# Run
- Go to the YOLO_DETECTION folder
- run python3 gui.py
- select the parameters and you video source
- click the start analyse button
- after the program closes run python3 start.py

It should now work.

If you are having problems with the GUI you can also manualy edit the main.py script and then run "python3 main.py" to start the detection. 

If you are having problems starting the program:
- Make sure you have selected the right Camera input!
- Installed all packages
- Have a CUDA compatible GPU and that CUDA is working

# Manager Installation
- Install manager
https://github.com/openremote/openremote/blob/master/README.md

- Setup HTTP API 
https://github.com/openremote/or-objectdetection/wiki/Editing-Seting-up-the-HTTP-API-connection-with-the-manager

THIS REPO IS WORK IN PROGRESS. THERE ARE BUGS! A DETAILED INSTRUCTIONS WILL COME LATER.


