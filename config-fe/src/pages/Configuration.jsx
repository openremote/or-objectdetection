import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Grid, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player';
import Chip from '@material-ui/core/Chip';

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
                    <InputLabel className={classes.inputTitle}><b>Display name:</b></InputLabel>
                    <FormControl className={classes.formControl}>
                        <TextField size="normal" id="standard-basic" value="Kruispunt XY" />
                    </FormControl>

                    <InputLabel className={classes.inputTitle}><b>Selecteer Detecties</b></InputLabel>
                    <FormControl className={classes.formControl}>
                        <TextField select size="normal" value="" onChange={e => handleSelect(e)}>
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
                    </FormControl>
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
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3" className={classes.title}>
                        Camera Preview
                    </Typography>
                    <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
                </Grid>
            </Grid>
        </div>
    )
}

export default Configuration;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '50%',
        display: ''
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    title: {
        color: '#4D9D2A',
        marginBottom: '20px'
    },
    inputTitle: {
        marginTop: '30px'
    },
    Buttons: {
        marginTop: '10px'
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
    }
}));