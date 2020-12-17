import time
import threading

from paho.mqtt import client as mqtt_client

class VideoDetectionWorker(threading.Thread):
    def __init__(self, broker, port, client_id):
        self.connect_mqtt(broker, port, client_id)

        super(VideoDetectionWorker, self).__init__()

    def connect_mqtt(self, broker, port, client_id):
        def run(self):
            super(VideoDetectionWorker, self).run()

        def on_connect(self, client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, return code %d\n", rc)
    
        client = mqtt_client.Client(client_id)
        client.on_connect = on_connect
        client.connect(broker, int(port)) # TODO: Add support for brokers with authentication
        return client

    def publish(self, client):
        msg_count = 0
        while True:
            time.sleep(1)
            msg = f"messages: {msg_count}"
            result = client.publish("/python/mqtt", msg)
            status = result[0]
            if status == 0:
                print(f"Send `{msg}` to topic `/python/mqtt`")
            else:
                print(f"Failed to send message to topic /python/mqtt")
            msg_count += 1