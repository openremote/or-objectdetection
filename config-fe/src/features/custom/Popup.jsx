import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    CardHeader,
    CardMedia,
    Grid,
    Typography,
    CardActions,
    Card,
    CardContent,
    Box,
    TextField,
    Avatar
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Image from "../../Images/CamPlaceholder.PNG";
import { grey } from "@material-ui/core/colors";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import plusIcon from "assets/plusicon.png";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    title: {
        fontSize: 14
    },
    title1: {
        fontWeight: 600,
        margin: 45,
        textAlign: "left"
    },
    title2: {
        marginBottom: 15,
        textAlign: "left"
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
        marginBottom: 20,
        fontWeight: 500,
        width: "70%",
        minWidth: 280,
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4D9D2A"
        },
        "& .MuiInputLabel-outlined": {
            color: "#4D9D2A"
        }
    },
    urlField: {
        width: "100%",
    },
    credentialsField: {
        width: "30%",
        marginRight: 20,
        marginTop: 20,
        marginBottom: 30
    },

    paper: {
        borderRadius: 15,
        padding: 20
    },
    tab: {
        width: "100%",
        "& .MuiTab-root": {
            maxWidth: 1000,
        },
    }
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
            borderColor: "#4D9D2A",
        }
    },
    mediaContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    "@keyframes pulse": {
        "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.7)"
        },
        "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 10px rgba(0, 0, 0, 0)"
        },
        "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)"
        }
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function Popup(props) {
    const classes = useStyles();
    const pulseclasses = pulseStyles();
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                >
                    <Tab label="Simpele Configuratie" {...a11yProps(0)} className={classes.tab} />
                    <Tab label="Geavanceerde Configuratie" {...a11yProps(1)} className={classes.tab} />
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
                    <Typography className={classes.title2} variant="h6">
                        Via Stream URL:
          </Typography>

                    <Box>
                        <TextField
                            className={classes.textField, classes.urlField}
                            id="outlined-basic"
                            label="URL"
                            placeholder="https://www.openremote.com/media/street.mp4"
                        />
                        <TextField
                            className={classes.textField, classes.credentialsField}
                            id="outlined-basic"
                            label="Username"
                        />
                        <TextField
                            className={classes.textField, classes.credentialsField}
                            id="outlined-basic"
                            label="Password"

                        />
                    </Box>
                    <Box>
                        <Button variant="contained" color="primary" size="large">
                            Toevoegen
            </Button>
                    </Box>
                </TabPanel>

                <DialogContent>




                </DialogContent>
            </Dialog>
        </div>
    );
}
