import React from 'react';
import { connect } from 'react-redux'
import { LoadVideoSources, AddVideoSource } from 'store/modules/video_sources/sourcesSlice'

import { Grid, Typography } from '@material-ui/core';
import Popup from 'features/custom/Popup'
import CustomVideoCard from 'features/card/customVideoCard';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => ({
    feeds: state.sources.videoSources
});
const mapDispatch = { LoadVideoSources, AddVideoSource }

const useStyles = (theme) => ({
    title: {
        marginBottom: 22,
    }
});

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.LoadVideoSources();
    }

    render() {
        const { classes, feeds } = this.props;
        return (
            <div>
                <Typography className={classes.title} variant="h4" color="primary">
                    VIDEO SOURCES
                </Typography>

                <Grid container spacing={1}>
                    {feeds.map((value, index) => {
                        return (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                            <CustomVideoCard
                                Id={value.id}
                                SourceName={value.name}
                                SubName={value.location}
                                Descripton={value.description}
                                SourceType={value.feed_type}
                            />
                        </Grid>)
                    })}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} heigth="100%">
                        <Popup />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatch)(withStyles(useStyles)(Dashboard));