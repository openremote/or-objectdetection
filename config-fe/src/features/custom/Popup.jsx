import React from "react";
import { connect } from 'react-redux'
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardHeader, CardMedia, Grid, Typography, CardActions, Card, CardContent, Box, TextField, Avatar, Dialog, Slide, Tab, Tabs } from "@material-ui/core";
import Image from "../../Images/CamPlaceholder.PNG";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import plusIcon from "assets/plusicon.png";
import PropTypes from "prop-types";
<<<<<<< HEAD
import { LoadVideoSources, AddVideoSource } from 'store/modules/video_sources/sourcesSlice'
import getDimensions from 'get-video-dimensions';
=======
import { AddVideoSource } from 'store/modules/video_sources/sourcesSlice'
>>>>>>> 3aecaf0bcdf3d62007147b2f890845a002341ef4

const useStyles = makeStyles({
    title: {
        fontSize: 14
    },
    title1: {
        fontWeight: 600,
        margin: 45,
        textAlign: "center"
    },
    title2: {
        marginBottom: 15,
        textAlign: "left"
    },
    title3: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: "left"
    },
    successMessage: {
        fontSize: 14,
        fontWeight: 400,
        marginBottom: 15,
        paddingLeft: 10,
        textAlign: "left",
        backgroundColor: "#57c22d",
        color: "white",
        borderRadius: 5,
        lineHeight: 3,

    },
    pos: {
        marginBottom: 12
    },
    card: {
        minWidth: 275,
        backgroundImage: `url(${Image})`,
        backgroundSize: "100%",
        marginTop: 33,
        marginBottom: 30,
    },
    textField: {
        width: "30%",
        marginRight: 20,
        marginBottom: 20,
    },
    urlField: {
        width: "100%",
        marginBottom: 20,
    },
    credentialsField: {
        width: "30%",
        marginRight: 20,
        marginBottom: 50,
    },
    paper: {
        borderRadius: 15,
        padding: 20,
        alignContent: "center",
        alignItems: "center"
    },
});

const pulseStyles = makeStyles((theme) => ({
    media: {
        height: 0,
        width: "50%",
        paddingTop: "56.25%"
    },
    avatar: {
        backgroundColor: "#4D9D2A",
    },
    title: {
        color: "grey"
    },
    root: {
        height: 358,
        opacity: "0.5",
        cursor: "pointer",
        "& .MuiPaper-outlined": {
            border: "2px solid rgb(77, 157, 42)",
            borderRadius: 50,
        }
    },
    mediaContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const mapStateToProps = state => ({
    feeds: state.sources.videoSources
});
const mapDispatch = { AddVideoSource }

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={5}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

function Popup(props) {
    const classes = useStyles();
    const pulseclasses = pulseStyles();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [newFeed, setNewFeed] = React.useState({
        name: "",
        location: "",
        description: "",
        url: "",
        feed_type: 1,
        active: false
    });

    const editName = target => {
        setNewFeed(prev => ({ ...prev, name: target.value }))
    };

    const editLocation = target => {
        setNewFeed(prev => ({ ...prev, location: target.value }))
    };

    const editDescription = target => {
        setNewFeed(prev => ({ ...prev, description: target.value }))
    };

    const editUrl = target => {
        setNewFeed(prev => ({ ...prev, url: target.value }))
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onFormSubmit = e => {
        e.preventDefault();
        console.log(newFeed)

        //get video resolution
        getVideoDimensionsOf(newFeed.url)
            .then(({ width, height }) => {
                console.log("Video width: " + width);
                console.log("Video height: " + height);
            });

        //props.AddVideoSource(newFeed);

        setSuccess(true);
    }

    function getVideoDimensionsOf(url) {
        return new Promise(function (resolve) {
            // create the video element
            let video = document.createElement('video');

            // place a listener on it
            video.addEventListener("loadedmetadata", function () {
                // retrieve dimensions
                let height = this.videoHeight;
                let width = this.videoWidth;
                // send back result
                resolve({
                    height: height,
                    width: width
                });
            }, false);

            // start download meta-datas
            video.src = url;
        });
    }

    return (
        <div>
            <Card
                className={pulseclasses.root}
                raised
                variant="outlined"
                onClick={handleClickOpen}
            >
                <CardHeader
                    avatar={
                        <Avatar className={pulseclasses.avatar}>
                            <AddCircleIcon />
                        </Avatar>
                    }
                    classes={{
                        title: pulseclasses.title,
                        subheader: pulseclasses.title
                    }}
                    titleTypographyProps={{ variant: "h6" }}
                    title={"New Source"}
                    subheader={"Click here to add a new source"}
                />
                <div className={pulseclasses.mediaContainer}>
                    <CardMedia
                        className={pulseclasses.media}
                        title="plusIcon"
                        image={plusIcon}
                    />
                </div>
            </Card>

            <Dialog
                classes={{
                    root: classes.root,
                    paper: classes.paper
                }}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={"md"}
            >
                <Typography
                    className={classes.title1}
                    variant="h3"
                    fontWeight="bold"
                    color="primary"
                    align="center"
                >
                    Add New Video Source
                        </Typography>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Quick ADD" {...a11yProps(0)} className={classes.tab} />
                    <Tab label="Manual config" {...a11yProps(1)} className={classes.tab} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <Grid container justify="center" spacing={3}>

                        {/* Voegt 3 cards toe */}
                        {[0, 1, 2].map((value) => (
                            <Grid key={value} item>
                                {/* Card met content */}
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Typography className={classes.title} gutterBottom>
                                            Camera 1
                                        </Typography>
                                        <Typography variant="h5">Hallway</Typography>
                                        <Typography className={classes.pos}>Building TQ</Typography>
                                    </CardContent>

                                    <CardActions>
                                        <Button variant="contained" color="primary" size="small">
                                            ADD
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>


                    {success ? <Typography className={classes.successMessage}>
                        Video successfully added!
                    </Typography> : null}

                    <Typography className={classes.title3} >
                        New feed config:
                    </Typography>
                    <form onSubmit={onFormSubmit}>
                        <Box>
                            <TextField
                                className={classes.textField}
                                id="outlined-basic"
                                required="Required"
                                label="Name"
                                onInput={e => editName(e.target)}
                            />
                            <TextField
                                className={classes.textField}
                                id="outlined-basic"
                                label="Location"
                                onInput={e => editLocation(e.target)}
                            />
                            <TextField
                                className={classes.urlField}
                                id="outlined-basic"
                                label="Description"
                                required="Required"
                                onInput={e => editDescription(e.target)}
                            />
                            <TextField
                                className={classes.urlField}
                                id="outlined-basic"
                                label="URL"
                                required="Required"
                                placeholder="https://www.openremote.com/media/street.mp4"
                                onInput={e => editUrl(e.target)}
                            />
                            <TextField
                                className={classes.credentialsField}
                                id="outlined-basic"
                                label="Username"
                            />
                            <TextField
                                className={classes.credentialsField}
                                id="outlined-basic"
                                label="Password"
                            />
                        </Box>
                        <Box>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                ADD
                            </Button>
                        </Box>
                    </form>
                </TabPanel>
            </Dialog>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatch)(Popup);
