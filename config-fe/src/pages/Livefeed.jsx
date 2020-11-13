import React from 'react';
import clsx from 'clsx';
import { Client, Message } from '@stomp/stompjs';

import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

const styles = theme => ({
    videoPlayer: {
        width: '100%',
        height: '90vh',
        border: '1px solid grey'
    }
})

class Livefeed extends React.Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.imageRef = React.createRef();
        this.context = null;
        this.stompClient = null;
    }

    componentDidMount() {
        //this.context = this.imageRef.current.getContext("2d");
        this.connectToRabbitMQ(this.id);
    }

    connectToRabbitMQ(id) {
        //configure stompclient
        this.stompClient = new Client({
            brokerURL: 'ws://192.168.99.100:15674/ws',
            connectHeaders: {
              login: 'rabbitmq',
              passcode: 'rabbitmq',
              durable: 'true',
              'auto-delete': 'false',
              'prefetch-count': '1'
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 15000,
            heartbeatOutgoing: 15000,
        });

        //attempt to connect to rabbitmq
        this.stompClient.activate();

        this.stompClient.onConnect =  (frame) => {
            console.log("CONNECTED TO RABBITMQ")

            var subscription = this.stompClient.subscribe("/queue/video-queue", onQueueMessage);
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
        };

        var onQueueMessage = (message) => {
            let image = new Image();
            let blob = new Blob([message.binaryBody]);
            let url = URL.createObjectURL(blob);
            document.querySelector("#image").src = url;
            /*image.onload = () => {

                URL.revokeObjectURL(url)
                var wrh = image.width / image.height;
                var newWidth = this.imageRef.current.clientWidth;
                var newHeight = newWidth / wrh;
                if (newHeight > this.imageRef.current.clientHeight) {
                    newHeight = this.imageRef.current.clientHeight;
                    newWidth = newHeight * wrh;
                }

                this.context.drawImage(image, 0, 0, 200 , 200);
            }
            image.src = url;*/
        }
    }

    componentWillUnmount() {
        this.stompClient.deactivate();
    }

    render() {
        const { classes } = this.props;
        return(
            <Container maxWidth={false}>
                <img id="image" className={clsx(classes.videoPlayer)}/>
                {/*<canvas className={clsx(classes.videoPlayer)} ref={this.imageRef}/> */}
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);