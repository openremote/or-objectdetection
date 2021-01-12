import React from 'react';
import { connect } from 'react-redux'
import { LoadVideoSources, AddVideoSource, StartStopVideoSource } from 'store/modules/video_sources/sourcesSlice'
import { FeedChangeEvent } from 'api/FeedApi';

import { Grid, Typography } from '@material-ui/core';
import Popup from 'features/custom/Popup'
import CustomVideoCard from 'features/card/customVideoCard';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => ({
    feeds: state.sources.videoSources,
    snapshots: state.sources.snapshots
});
const mapDispatch = { LoadVideoSources, AddVideoSource, StartStopVideoSource }

const useStyles = (theme) => ({
    title: {
        marginBottom: 22,
    }
});

class Dashboard extends React.Component {
    OnChangeFeedActive = (id) => {
        let tempFeedStartChangeEvent = {
            feed_id: id
        };

        this.props.StartStopVideoSource(tempFeedStartChangeEvent);
    }

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
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} heigth="100%">
                        <Popup />
                    </Grid>

                    {feeds.map((value, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                                <CustomVideoCard
                                    Id={value.id}
                                    SourceName={value.name}
                                    SubName={value.location}
                                    Descripton={value.description}
                                    SourceType={value.feed_type}
                                    Active={value.active}
                                    Snapshot={(this.props.snapshots && this.props.snapshots.length > 0) ? this.props.snapshots.find(x => x.feed_id == value.id)?.snapshot : null}
                                    OnStartStop={this.OnChangeFeedActive}
                                    Feed={value}
                                />
                            </Grid>)
                    })}

                </Grid>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatch)(withStyles(useStyles)(Dashboard));