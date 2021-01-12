import { Client } from '@stomp/stompjs';

//fetch environment variables
let rabbitMQUrl = process.env.RABBIT_URL || "ws://192.168.99.100:15674/ws";
let rabbitMQUser = process.env.RABBIT_USER || "rabbitmq";
let rabbitMQPass = process.env.RABBIT_PASS || "rabbitmq";

//create client instance and pass it to the importer, they can then do any further setup before calling stompClient.activate to attempt to connect to rabbitMQ.
let stompClient = new Client({
    brokerURL: rabbitMQUrl,
    connectHeaders: {
      login: rabbitMQUser,
      passcode: rabbitMQPass,
      durable: 'true',
      'auto-delete': 'false',
      'prefetch-count': '1'
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
});

export function fetchNewStompClient() {
  let temp = new Client({
    brokerURL: rabbitMQUrl,
    connectHeaders: {
      login: rabbitMQUser,
      passcode: rabbitMQPass,
      durable: 'true',
      'auto-delete': 'false',
      'prefetch-count': '1'
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 15000,
    heartbeatOutgoing: 15000,
  });

  return temp;
}

export default stompClient;
