import os
import random

from workers.MQTTWorker import MQTTWorker

def startMQTTWorker():
    broker = os.getenv("MQTT_HOST")
    port = os.getenv("MQTT_PORT", 1883)
    client_id = os.getenv("MQTT_CLIENT_ID", f'python-mqtt-{random.randint(0, 1000)}')
    username = os.getenv("MQTT_USERNAME")
    password = os.getenv("MQTT_PASSWORD")

    if not broker:
        print("No MQTT host spcified. MQTT disabled.")
    else:
        print("Starting MQTTWorker.....")
        worker = MQTTWorker(broker, port, client_id, username, password)
        worker.start()