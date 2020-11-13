import React from 'react';
import clsx from 'clsx';
import Stomp from 'stompjs'

import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';


/*const io = require("socket.io-client");
const socket = io('http://localhost:5050');

socket.on('connect', () => {
    console.log('socket.io-client on connect')
})

socket.on("video", function(data) {
    console.log("RECEIVED VIDEO MESSAGE");
});

socket.on("message", function(data) {
    console.log("RECEIVED message");
}); */


const styles = theme => ({
    videoPlayer: {
        width: '100%',
        height: '90vh'
    }
})

class Livefeed extends React.Component {
    constructor(props) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            image: null
        };

        this.connectToRabbitMQ(id);
    }

    connectToRabbitMQ(id) {
        let stompClient
        var ws = new WebSocket('ws://192.168.99.100:15674/ws')
        const headers = {
            'login': 'rabbitmq',
            'passcode': 'rabbitmq',
            'durable': 'true',
            'auto-delete': 'false'
        }
        stompClient = Stomp.over(ws)
        stompClient.connect(headers , (frame) => {
                console.log('Connected')
                const subscription = stompClient.subscribe('/queue/video-queue', (message) => {
                    console.log(message);
                    //this.state.image = message.body;
                })
        })

    }

    render() {
        const { classes } = this.props;
        return(
            <Container maxWidth={false}>
                {/*<video
                    id="feed-player"
                    class="video-js vjs-default-skin vjs-16-9"
                    className={clsx(classes.videoPlayer)}
                    autoPlay
                    muted
                    data-setup='{
                        "aspectRatio":"16:9", "fluid": true
                    }'>
                        <source src="http://localhost:5000/video_feed" type="multipart/x-mixed-replace"></source>
                    <p class="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">
                        supports HTML5 video
                        </a>
                    </p>
                </video> */}
                <img className={clsx(classes.videoPlayer)} src=""/>
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);