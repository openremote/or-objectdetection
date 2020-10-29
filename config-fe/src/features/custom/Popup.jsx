import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CardHeader, CardMedia, Grid, Typography, CardActions, Card, CardContent, Box, TextField, Avatar } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Image from '../../Images/CamPlaceholder.PNG';
import { grey } from '@material-ui/core/colors';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import plusIcon from 'assets/plusicon.png';

const useStyles = makeStyles({
    title: {
        fontSize: 14,
    },
    title1: {
        fontWeight: 600,
        marginBottom: 45,
    },
    title2: {
        marginBottom: 15,
        marginTop: 80,
        textAlign: "center",
    },
    pos: {
        marginBottom: 12,
    },
    card: {
        minWidth: 275,
        backgroundImage: `url(${Image})`,
        backgroundSize: '100%'
    },
    textField: {
        marginTop: 10,
        marginBottom: 20,
        fontWeight: 500,
        width: "70%",
        minWidth: 280,
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4D9D2A"
        },
        "& .MuiInputLabel-outlined": {
            color: "#4D9D2A"
        },
    },
    paper: {
        borderRadius: 15,
        padding: 20,
    }
});

const pulseStyles = makeStyles(theme => ({
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
        height: 358,
        opacity: "0.5",
        cursor: "pointer",
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Popup() {

    const classes = useStyles();
    const pulseclasses = pulseStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Card className={pulseclasses.root} raised variant="outlined" onClick={handleClickOpen}>
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
                    titleTypographyProps={{ variant: 'h6' }}
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
                maxWidth={'md'}
            >

                <DialogContent marginBottom={30}>
                    <Typography className={classes.title1} variant="h3" fontWeight="bold" color="primary" align="center" >
                        Add New Video Source
                    </Typography>

                    <Grid container justify="center" spacing={4}>
                        {/* Voegt 3 cards toe */}
                        {[0, 1, 2].map((value) => (
                            <Grid key={value} item>
                                {/* Card met content */}
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Typography className={classes.title} color="black" gutterBottom>
                                            Camera 1
                                    </Typography>
                                        <Typography variant="h5">
                                            Hallway
                                    </Typography>
                                        <Typography className={classes.pos} color="black">
                                            Building TQ
                                     </Typography>
                                    </CardContent>

                                    <CardActions>
                                        <Button variant="contained" color="primary" size="small" >ADD</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography className={classes.title2} variant="h6">
                        Add stream via url:
                    </Typography>

                    <Box align="center">
                        <TextField className={classes.textField} id="outlined-basic" label="URL" variant="outlined" />
                    </Box>
                    <Box align="center" >
                        <Button variant="contained" color="primary" size="large" marginBottom={30}>ADD</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
