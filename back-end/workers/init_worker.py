import eventlet
from kombu import Connection, Exchange, Queue
from workers.VideoFeedWorker import Worker

# Default RabbitMQ server URI
rabbit_url = 'amqp://rabbitmq:rabbitmq@192.168.99.100:5672//'


# starts the rabbitMQ consumer worker, which will read all rabbitmq video feed messages and pass them to a websocket
# server, this way we can make sure the backend is responsible for the consuming of the queue and not the front end
# using amqplib
def startConsumingWorker():
    print("starting consuming worker.....")
    exchange = Exchange("video-exchange", type="direct")
    queues = [Queue("video-queue", exchange, routing_key="video")]
    with Connection(rabbit_url, heartbeat=4) as conn:
        worker = Worker(conn, queues)
        worker.start()
        #worker.run()
