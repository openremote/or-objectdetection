import React from 'react';
import clsx from 'clsx';
import stompClient from 'rabbitMQ/rabbitMQ'
import Editor from 'features/custom/Editor'

import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

const styles = theme => ({
    videoPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '90vh',
        border: '1px solid grey',
        zIndex: '-1'
    }
})

class Livefeed extends React.Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.stompClient = null;

        //create imageref so we can copy these values to the editor element.
        this.imageRef = React.createRef();
        this.state = { 
            imageWidth: 0, 
            imageHeight: 0 
        };
    }

    componentDidMount() {
        this.connectToRabbitMQ(this.id);
        this.setState({
            imageWidth: this.imageRef.current.offsetWidth,
            imageHeight: this.imageRef.current.offsetHeight,
        });
    }

    connectToRabbitMQ(id) {
        //fetch stompclient instance
        this.stompClient = stompClient;

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
            <Container disableGutters maxWidth={false} style={{position: 'relative'}}>
                {/* <div className={clsx(classes.test)}/> */}
                <Editor width={this.state.imageWidth} height={this.state.imageHeight}/>
                <img id="image" className={clsx(classes.videoPlayer)} ref={this.imageRef}/> 
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);