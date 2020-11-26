import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, TextField, FormGroup, FormControlLabel, Checkbox, Button, Chip, CardContent, FormControl, MenuItem, InputLabel, Box } from '@material-ui/core';
import ReactPlayer from 'react-player';
import Canvas from 'react-canvas-draw'

const Configuration = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        gilad: false,
        jason: false,
        antoine: false,
        bert: false,
        jan: false,
        peer: false,
        johan: false
    });

    const canvasprops = {
        color: "rgb(56, 255, 20, 80%)",
        width: "640px",
        height: "360px",
        brushRadius: 3,
        lazyRadius: 8
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const { D, BB, CLC, CO, SOS, VC } = state;

    const handleDelete = chipToDelete => () => {
        setChipData(chips => chips.filter(chips => chips.key !== chipToDelete.key));
    };

    const handleSelect = e => {
        setChipData([...chipData, { key: e.target.value, label: e.target.value }]);
    };

    const id = props.match.params.id;

    const [chipData, setChipData] = React.useState([]);

    const detectionOptions = [
        { key: 1, label: "Person" },
        { key: 2, label: "Car" }
    ];



    return (
        <div>
            <Grid container spacing={3} style={{ margin: '1%' }}>
                <Grid item xs={6} >
                    <Typography variant="h3" className={classes.title}>
                        Configuratie - Camera X
                    </Typography>

                    <Card className={classes.root}>
                        <CardContent className={classes.cardContent}>
                            <Box className={classes.box}>
                                <div style={{ display: "inline-block" }}>
                                    <InputLabel className={classes.inputTitle}><b>Naam:</b></InputLabel>
                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <TextField size="normal" id="standard-basic" value="Kruispunt XY" />
                                    </Typography>
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <InputLabel className={classes.inputTitle}><b>Locatie:</b></InputLabel>
                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <TextField size="normal" id="standard-basic" value="Strijp S" />
                                    </Typography>
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <InputLabel className={classes.inputTitle}><b>Type:</b></InputLabel>
                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <TextField size="normal" id="standard-basic" value="Camera C920" disabled />
                                    </Typography>
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <InputLabel className={classes.inputTitle}><b>Resolutie:</b></InputLabel>
                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <TextField size="normal" id="standard-basic" value="1920x1080" disabled />
                                    </Typography>
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <InputLabel className={classes.inputTitle}><b>Framerate:</b></InputLabel>
                                    <Typography className={classes.title2} color="textSecondary" gutterBottom>
                                        <TextField size="normal" id="standard-basic" value="30fps" disabled />
                                    </Typography>
                                </div>
                                <InputLabel className={classes.inputTitle}><b>Url:</b></InputLabel>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <TextField className={classes.textField} size="normal" id="standard-basic" value="https://www.openremote.com/videofeed/kruispunt" />
                                </Typography>
                                <InputLabel className={classes.inputTitle}><b>Selecteer Detecties</b></InputLabel>
                                <TextField className={classes.comboField} select size="normal" value="" onChange={e => handleSelect(e)}>
                                    {detectionOptions.map(option => (
                                        <MenuItem key={option.key} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <ul className={classes.chipControl}>
                                    {
                                        chipData.map((data, index) => {
                                            return (
                                                <Chip
                                                    className={classes.chip}
                                                    key={data.key + index}
                                                    label={data.label}
                                                    onDelete={handleDelete(data)}
                                                    color="primary"
                                                />
                                            );
                                        })
                                    }
                                </ul>
                                <InputLabel className={classes.inputTitle}><b>Detectie Opties</b></InputLabel>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox checked={D} onChange={handleChange} name="D" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Directions"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={BB} onChange={handleChange} name="BB" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Boundary Boxes"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={CLC} onChange={handleChange} name="CLC" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Calculate Line Cross"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={CO} onChange={handleChange} name="CO" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Count Objects"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={SOS} onChange={handleChange} name="SOS" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Show object speed"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={VC} onChange={handleChange} name="VC" style={{
                                                color: "#4D9D2A",
                                            }} />}
                                            label="Visualize Centers"
                                        />
                                        <Button variant="contained" color="primary" className={classes.Buttons}>
                                            Save
                                        </Button>
                                        <Button variant="contained" color="default" className={classes.Buttons}>
                                            Cancel
                                        </Button>
                                    </FormGroup>
                                </FormControl>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3" className={classes.title}>
                        Camera Preview
                    </Typography>
                    <ReactPlayer url='https://www.youtube.com/watch?v=njCzFI149Rc' />

                    <Canvas
                        brushColor={canvasprops.color}
                        brushRadius={canvasprops.brushRadius}
                        lazyRadius={canvasprops.lazyRadius}
                        canvasWidth={canvasprops.width}
                        canvasHeight={canvasprops.height}
                        imgSrc="https://static.dw.com/image/47113704_303.jpg"
                    />
                </Grid>
            </Grid>
        </div >
    )
}

export default Configuration;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: '100%',
        display: "flex",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    title: {
        color: '#4D9D2A',
        marginBottom: '20px',
    },
    title2: {
        color: '#4D9D2A',
        marginBottom: '20px',
        width: "100%",
        display: "inline-block",
        marginRight: 40,
    },
    inputTitle: {
        marginTop: '30px',
        width: "40%"
    },
    Buttons: {
        marginTop: '10px',
        width: "100%"
    },
    chipControl: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        marginTop: 10,
        maxWidth: 300,
        padding: 0
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    inputField: {
        height: 80,
    },
    box: {
        margin: "10px",
        width: "100%",
    },
    root: {
        width: "100%",
    },
    textField: {
        width: "100%",
    },
    comboField: {
        width: "50%",
    },
    cardContent: {
        display: "flex"
    }
}));