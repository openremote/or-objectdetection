import sys
import cv2
import numpy as np
import threading

from kombu.mixins import ConsumerMixin

# Kombu Message Consuming Worker
class Worker(ConsumerMixin, threading.Thread):
    def __init__(self, connection, queues):
        self.connection = connection
        self.queues = queues

        super(Worker, self).__init__()

    def run(self):
        super(Worker, self).run()

    def get_consumers(self, Consumer, channel):
        return [Consumer(queues=self.queues,
                         callbacks=[self.on_message],
                         accept=['image/jpeg'])]

    def on_message(self, body, message):
        print("RECEIVED MESSAGE FROM RABBITMQ")
        # get the original jpeg byte array size
        size = sys.getsizeof(body) - 33
        # jpeg-encoded byte array into numpy array
        np_array = np.frombuffer(body, dtype=np.uint8)
        np_array = np_array.reshape((size, 1))
        # decode jpeg-encoded numpy array to the frame.
        image = cv2.imdecode(np_array, 1)

        # import socketIO instance so we can emit messages outside if socket.on scope.
        from init import socketio
        #socketio.send(image)
        socketio.send("GOEDENDAG")
        # send message ack
        message.ack()
