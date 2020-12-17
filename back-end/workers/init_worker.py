import os
import random

from workers.VideoDetectionWorker import VideoDetectionWorker

def startVideoDetectionWorker():
    broker = os.getenv("MQTT_HOST", "127.0.0.1")
    port = os.getenv("MQTT_PORT", 1883)
    client_id = os.getenv("MQTT_CLIENT_ID", f'python-mqtt-{random.randint(0, 1000)}')

    print("Starting videoDetectionWorker.....")
    worker = VideoDetectionWorker(broker, port, client_id)
    worker.start()