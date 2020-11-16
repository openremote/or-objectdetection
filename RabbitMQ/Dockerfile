FROM rabbitmq:3-management

RUN rabbitmq-plugins enable rabbitmq_stomp
RUN rabbitmq-plugins enable --offline rabbitmq_web_stomp

RUN \
    echo 'web_stomp.ws_frame = binary' >> /etc/rabbitmq/rabbitmq.conf

EXPOSE 15674

