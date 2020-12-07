from kombu import Exchange, Queue

# Default RabbitMQ server URI
rabbit_url = 'amqp://rabbitmq:rabbitmq@192.168.99.100:5672//'

# Define queues that will be used in the future
feed_queue = Queue('feed-queue', Exchange("feed-exchange", type="direct"), routing_key='feed')

