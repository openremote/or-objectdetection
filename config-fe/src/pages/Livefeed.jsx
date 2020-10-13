import React from 'react';
import clsx from 'clsx';

import { Container } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

const styles = theme => ({
    videoPlayer: {
        width: '100%',
        height: '80vh'
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
                <video
                    id="feed-player"
                    class="video-js vjs-default-skin vjs-16-9"
                    className={clsx(classes.videoPlayer)}
                    autoPlay
                    muted
                    data-setup='{
                        "aspectRatio":"16:9", "fluid": true
                    }'>
                    <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
                    <p class="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">
                        supports HTML5 video
                        </a>
                    </p>
                </video>
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Livefeed);