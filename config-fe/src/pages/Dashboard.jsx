import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import Popup from 'features/custom/Popup'
import CustomVideoCard from 'features/card/customVideoCard';
import { withStyles } from '@material-ui/core/styles';
import User from '../Model/User';

const useStyles = (theme) => ({
    title: {
        marginBottom: 22,
    }
});

class Dashboard extends React.Component {
    //method responsible for fetching video sources
    fetchVideoSources() {

    }

    // componentDidMount() {
    //     if (User.getID() === null) {
    //         this.props.history.push("/login");
    //     }
    // }

    render() {
        const { classes } = this.props;
        const { user } = User.getID;
        return (
            <div>
                <h1>{user}</h1>
                <Typography className={classes.title} variant="h4" color="primary">
                    VIDEO SOURCES
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <CustomVideoCard
                            Id={"74bc2a9b-c9b9-44cf-95e6-954da5449b1a"}
                            SourceName={"Traffic Cam"}
                            SubName={"Eindhoven"}
                            Descripton={"Wat een mooie descriptie ofniet?"}
                            SourceType={"IP_CAM"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <CustomVideoCard
                            Id={"2cde58f1-1b38-440a-ac25-9a2fab17542d"}
                            SourceName={"Traffic Cam"}
                            SubName={"Eindhoven"}
                            Descripton={"Wat een mooie descriptie ofniet?"}
                            SourceType={"WEBCAM"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <CustomVideoCard
                            Id={"cc1933b5-44ff-4ed2-b1d6-97fbf4ddcb21"}
                            SourceName={"Traffic Cam"}
                            SubName={"Eindhoven"}
                            Descripton={"Wat een mooie descriptie ofniet?"}
                            SourceType={"LIVE_FEED"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} heigth="100%">
                        <Popup />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(useStyles)(Dashboard);