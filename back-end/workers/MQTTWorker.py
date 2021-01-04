import time
import threading

from paho.mqtt import client as mqtt_client

class MQTTWorker(threading.Thread):
    def __init__(self, broker, port, client_id, username, password):
        self.connect_mqtt(broker, port, client_id, username, password)

        super(MQTTWorker, self).__init__()

    def connect_mqtt(self, broker, port, client_id, username, password):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                client.connected_flag = True
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, returned code =", rc)
                client.bad_connection_flag=True

        def on_disconnect(client, userdata, rc):
            print("disconnecting reason "  +str(rc))
            client.connected_flag=False
            client.disconnect_flag=True

        # Setup an MQTT client
        mqtt_client.Client.connected_flag=False
        mqtt_client.Client.bad_connection_flag=False
        client = mqtt_client.Client(client_id)
        client.on_connect = on_connect
        client.on_disconnect = on_disconnect
        client.loop_start()
        if username and password:
            client.username_pw_set(username, password)

        try:
            client.connect(broker, int(port))
        except:
            print("connection failed")
            exit(1)
        while not client.connected_flag and not client.bad_connection_flag:
            print("In wait loop")
            time.sleep(1)
        if client.bad_connection_flag:
            client.loop_stop()
            exit(1)
        print("in Main loop")
        client.publish("openremote/od", "YEET")
        client.loop_stop()
        client.disconnect()

        return client

    def publish(self, client):
        msg_count = 0
        while True:
            time.sleep(5)
            msg = f"messages: {msg_count}"
            result = client.publish("/python/mqtt", msg)
            status = result[0]
            if status == 0:
                print(f"Send `{msg}` to topic `/python/mqtt`")
            else:
                print(f"Failed to send message to topic /python/mqtt")
            msg_count += 1