from flask import Response
from flask import Flask
from kombu import Connection, Exchange, Queue, Producer, Consumer
import os

def setup_rabbitMQ():
    rabbit_domain = os.environ.get('RABBITMQ_URL')
    rabbit_domain = rabbit_domain if rabbit_domain is not None else 'localhost'
    rabbit_url = 'amqp://rabbitmq:rabbitmq@'+rabbit_domain+':5672//'

    # Kombu Connection
    conn = Connection(rabbit_url)
    channel = conn.channel()
    # Kombu Exchange
    # - set delivery_mode to transient to prevent disk writes for faster delivery
    exchange = Exchange("video-exchange", type="direct", delivery_mode=1)
    # Kombu Producer
    producer = Producer(exchange=exchange, channel=channel, routing_key="video")
    # Kombu Queue
    queue = Queue(name="video-queue", exchange=exchange, routing_key="video") 
    queue.maybe_bind(conn)
    queue.declare()

    return queue, exchange, producer, conn
