# OpenRemote Object Tracking
Open source implementation of an object tracking algorithm that takes an input of a video source and calculates different parameters from the objects in the frame (people, bikes, cars) then displays the parameters (number of objects, average speed, direction of moving) and sends them to be displayed on the Open Remote manager throw an HTTP API in a Json format.

# demo of the application:
https://www.youtube.com/watch?v=1NQoLWasbcI

# Installation
- Docker
- Nvidia docker containers(linux should work out of the box) 
see: [https://github.com/NVIDIA/nvidia-docker](https://github.com/NVIDIA/nvidia-docker). For windows the support is still experimental on WSL2, so google [windows nvidia docker container](https://www.google.com/search?sxsrf=ALeKk03Mgi6HJgQd0sP4Z4n1oPDGvRcYbg%3A1610718889581&ei=qZ4BYKWDI8KAi-gPwYOj8AY&q=windows+nvidia+docker+container&oq=windows+nvidia+docker+container&gs_lcp=CgZwc3ktYWIQAzIGCAAQCBAeMgYIABAIEB46BAgAEEc6BwgjELACECc6CAgAEAgQBxAeUOYwWI03YNg5aABwAngAgAFgiAHCBJIBATiYAQCgAQGqAQdnd3Mtd2l6yAEFwAEB&sclient=psy-ab&ved=0ahUKEwjl-_u5i57uAhVCwAIHHcHBCG4Q4dUDCAw&uact=5) to find a good tutorial how to set it up.
- docker-compose

# Run
The running of the application is as simple as running:
1. sudo docker-compose build
2. sudo docker-compose up

or you can look for more detailed information of the containers in their respectable subfolders
After that you can open the application at [localhost:3000](http://localhost:3000).

# The containers
# Architecture
Below is a simple high level overview of all the components that make up the objectdetection, every piece will get a small summary to explain the function behind the container.

![image](https://raw.githubusercontent.com/openremote/or-objectdetection/develop/wiki/drawio/overview/overview.png)

# Front-end
The front-end is a small react application meant as a friendly GUI around the creation of and configuring of video feeds. Besides this the front-end also has a built-in editor for drawing detection lines, these lines are stored in the configuration and passed on to the object detection system. Of course, you are also able to view the analyzed frames of feeds on the front-end.

# Back-end
The back-end is responsible for storing all the data about video feeds (name, feed_url, etc) and communicating with the object detection on behalf of the front-end. It is a simple Flask REST API. The communication between the object detection and the backend is done using RabbitMQ as can be seen in the figure above, for this communication we use [kombu](https://github.com/celery/kombu).

# Object-Detection
The object detection container is responsible for, you guessed it, the object detection. The current iteration available in develop is a small worker which listens for start/stop signals and starts analyzing a feed when a signal is received. This only works when one feed is run at a time. 

The video feed is pulled from the URL using a python wrapper around [libVLC](https://www.videolan.org/vlc/libvlc.html), which has support for most common input types, currently we support two types of feeds:
   - YouTube live feeds
   - IP cams

We have worked on a proper asynchronous thread manager which can spawn multiple asynchronous video feed analysis threads to process multiple feeds at once. However, this requires a change to the way RabbitMQ handles messaging, so this is not implemented in the current iteration. However, would be a welcome improvement

# RabbitMQ
[RabbitMQ](https://www.rabbitmq.com/) is the message queue we have chosen for cross container asynchronous communication, the message queue is responsible for handling the start/stop signals between the back-end and object detection, besides this RabbitMQ also receives analyzed frames from the object detection in a queue, this queue can be subscribed to by any consumer of choice. However, in the default application the analyzed frames queue is consumed by the front end using the [STOMP Plugin](https://www.rabbitmq.com/stomp.html) to display live video feeds to the user in the browser.

