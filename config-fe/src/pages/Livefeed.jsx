import React from 'react';
import clsx from 'clsx';
import stompClient from 'rabbitMQ/rabbitMQ'
import { connect } from 'react-redux'
import OfflinePlaceholder from 'assets/offline.png';
import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

const mapStateToProps = state => ({
    feeds: state.sources.videoSources
});

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
        this.subscription = null;
    }

    componentDidMount() {
        //this.context = this.imageRef.current.getContext("2d");
        this.connectToRabbitMQ(this.id);
    }

    connectToRabbitMQ(id) {
        //check if feed is active before we connect
        let active = this.props.feeds?.find(x => x.id == this.id)?.active;
        if(active && active === true) {
            //fetch stompclient instance
            this.stompClient = stompClient;

            //attempt to connect to rabbitmq
            this.stompClient.activate();

            this.stompClient.onConnect =  (frame) => {
                console.log("CONNECTED TO RABBITMQ")

                this.subscription = this.stompClient.subscribe("/queue/video-queue", onQueueMessage);
                // Do something, all subscribes must be done is this callback
                // This is needed because this will be executed after a (re)connect
            };

            var onQueueMessage = (message) => {
                let blob = new Blob([message.binaryBody]);
                let url = URL.createObjectURL(blob);
                document.querySelector("#image").src = url;
            }
        } else {
            document.querySelector("#image").src = OfflinePlaceholder;
        }
    }

    componentWillUnmount() {
        this.subscription?.unsubscribe();
        this.stompClient?.deactivate();
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

export default connect(mapStateToProps)(withStyles(styles)(Livefeed));