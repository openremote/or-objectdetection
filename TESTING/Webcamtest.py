import numpy as np
import cv2

#cap = cv2.VideoCapture('http://root:root@192.168.70.52/mjpg/1/video.mjpg')
cap = cv2.VideoCapture(0)
 
while(True):

    ret, frame = cap.read()
    cv2.imshow('frame',frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
