import React from 'react';
import clsx from 'clsx';
import stompClient from 'rabbitMQ/rabbitMQ'
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
        //fetch stompclient instance
        this.stompClient = stompClient;

        //attempt to connect to rabbitmq
        this.stompClient.activate();

        this.stompClient.onConnect =  (frame) => {
            console.log("CONNECTED TO RABBITMQ")

            this.stompClient.subscribe("/queue/video-queue", onQueueMessage);
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
        };

        var onQueueMessage = (message) => {
            let blob = new Blob([message.binaryBody]);
            let url = URL.createObjectURL(blob);
            document.querySelector("#image").src = url;
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
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);