import React from 'react';

import { Grid, Typography, Card,CardHeader, CardMedia, CardContent, Avatar, CardActions} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import plusIcon from 'assets/plusicon.png';

import CustomVideoCard from 'features/card/customVideoCard';

const styles = theme => ({
    media: {
        height: 0,
        width: "50%",
        paddingTop: '56.25%',
    },
    avatar: {
        backgroundColor: grey[500],
    },
    title: {
        color: "grey",
    },
    root: {
        height: "100%",
        opacity: "0.5",
        animation: `$pulse 3000ms infinite ${theme.transitions.easing.easeInOut}`
    },
    mediaContainer: {
        display: "flex", 
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    "@keyframes pulse": {
        "0%": {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
        },
        "70%": {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
        },
        "100%": {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
        }
      },
});

class Dashboard extends React.Component {
    //method responsible for fetching video sources
    fetchVideoSources() {

    }

    render() {
        const classes = this.props.classes;
        return(
            <div>
                <Typography variant="h4" color="primary">
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
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Card className={classes.root}>  
                            <CardHeader
                                avatar={
                                    <Avatar className={classes.avatar}>
                                        <AddCircleIcon/>    
                                    </Avatar>
                                }
                                classes={{
                                    title: classes.title,
                                    subheader: classes.title
                                }}
                                titleTypographyProps={{variant:'h6' }}
                                title={"New Source"}
                                subheader={"Click here to add a new source"}
                            />
                            <div className={classes.mediaContainer}>
                                <CardMedia
                                    className={classes.media}
                                    title="plusIcon"
                                    image={plusIcon}
                                />
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Dashboard);