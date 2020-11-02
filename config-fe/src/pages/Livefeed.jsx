import React from 'react';
import clsx from 'clsx';

import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

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
                <img className={clsx(classes.videoPlayer)} src="http://localhost:5000/video_feed"/>
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);