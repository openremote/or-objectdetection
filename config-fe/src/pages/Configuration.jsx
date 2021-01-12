import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, TextField, FormGroup, Chip, FormControlLabel, Checkbox, Button, CardContent, FormControl, MenuItem, InputLabel, Box } from "@material-ui/core";
import Canvas from "../features/custom/Canvas2";
import { SaveConfig, LoadConfig, UpdateConfig } from "../store/modules/configuration/configSlice";
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Detections from '../Model/Detections';
import Autocomplete from '@material-ui/lab/Autocomplete';
import OfflinePlaceholder from 'assets/offline.png';

const useStyles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
        display: "flex"
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    title: {
        color: "#4D9D2A",
        marginBottom: "20px"
    },
    title2: {
        color: "#4D9D2A",
        marginBottom: "20px",
        width: "100%",
        display: "inline-block",
        marginRight: 40
    },
    inputTitle: {
        marginTop: "30px",
        width: "40%"
    },
    Buttons: {
        marginTop: "10px",
        width: "100%"
    },
    chipControl: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap",
        listStyle: "none",
        marginTop: 10,
        maxWidth: 300,
        padding: 0
    },
    autoComplete: {
        marginTop: "20px"
    },
    chip: {
        margin: theme.spacing(0.5)
    },
    inputField: {
        height: 80
    },
    box: {
        margin: "10px",
        width: "100%"
    },
    root: {
        width: "100%"
    },
    textField: {
        width: "100%"
    },
    comboField: {
        width: "50%"
    },
    cardContent: {
        display: "flex"
    }
});

const mapStateToProps = state => ({
    config: state.config.configSource,
    snapshots: state.sources.snapshots
});

const mapDispatch = { LoadConfig, SaveConfig, UpdateConfig }

class Configuration extends React.Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.configuration = {
            feed_id: this.props.match.params.id,
            name: "test",
            resolution: "",
            detection_types: [],
            drawables: ""
        };

        this.state = {
            isLoading: true,
            existingConfig: false,
            D: false,
            BB: false,
            CLC: false,
            CO: false,
            SOS: false,
            VC: false,
            value: [],
            detectionArray: [],
            fixedOptions: [],
        }
    }

    async componentDidMount() {
        await this.props.LoadConfig(this.props.match.params.id);
        if(this.props.config != null) {
            this.setState({ existingConfig: true });
            this.configuration.name = this.props.config.name;
            this.configuration.resolution = this.props.config.resolution;

            this.props.config.detections.map(object => {
                this.state.fixedOptions.push(object.detectionType);
            });
        }

        this.setState({ isLoading: false });
    }

    SnapshotAvailable() {
        if(this.props.snapshots && this.props.snapshots.length > 0) {
            let blob = this.props.snapshots.find(x => x.feed_id == this.props.match.params.id)?.snapshot;
            if(blob) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    FetchBlobPreview() {
        if(this.props.snapshots && this.props.snapshots.length > 0) {
            let blob = this.props.snapshots.find(x => x.feed_id == this.props.match.params.id)?.snapshot;
            if(blob) {
                let url = URL.createObjectURL(blob);
                return url;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    onChange = (event, value) => {
        this.configuration.detection_types = value;
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.checked
        });
        // this.configuration.detection_types.push(e.target.name)
    };

    onFormSubmit = e => {
        e.preventDefault();

        //check if we are updating an existing config or creating a new one.
        if(this.state.existingConfig) {
            this.configuration.id = this.props.config.id;
            this.props.UpdateConfig(this.configuration)
        } else {
            this.props.SaveConfig(this.configuration)
        }

        this.configuration.detection_types.map(object => {
            this.state.fixedOptions.push(object);
        });
    }

    handleDrawables = (drawables) => {
        this.configuration.drawables = drawables;
    }

    render() {
        const { classes, config } = this.props;
        const { isLoading } = this.state;
        //Directions, boundary boxes, calculate line cross, count objects, show object speed, visualize centers
        const { D, BB, CLC, CO, SOS, VC } = this.state;

        return (
            <div>
                { this.state.isLoading ?
                    <Typography variant="h3" className={classes.title}>
                        LOADING
                    </Typography>
                    :
                    <Grid container spacing={3} style={{ margin: "1%" }}>
                        <Grid item xs={6}>
                            <Typography variant="h3" className={classes.title}>
                                Configuratie - Camera X
                        </Typography>

                            <Card className={classes.root}>
                                <CardContent className={classes.cardContent}>
                                    <form onSubmit={this.onFormSubmit}>
                                        <Box className={classes.box}>
                                            <div style={{ display: "inline-block" }}>
                                                <InputLabel className={classes.inputTitle}>
                                                    <b>Naam:</b>
                                                </InputLabel>
                                                <Typography
                                                    className={classes.title2}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    <TextField
                                                        id="standard-basic"
                                                        defaultValue={config?.name}
                                                        onInput={e => this.configuration.name = e.target.value}
                                                    />
                                                </Typography>
                                            </div>
                                            <div style={{ display: "inline-block" }}>
                                                <InputLabel className={classes.inputTitle}>
                                                    <b>Locatie:</b>
                                                </InputLabel>
                                                <Typography
                                                    className={classes.title2}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    <TextField
                                                        id="standard-basic"
                                                        disabled
                                                    />
                                                </Typography>
                                            </div>
                                            <div style={{ display: "inline-block" }}>
                                                <InputLabel className={classes.inputTitle}>
                                                    <b>Type:</b>
                                                </InputLabel>
                                                <Typography
                                                    className={classes.title2}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    <TextField
                                                        id="standard-basic"
                                                        value="NSA cam"
                                                        disabled
                                                    />
                                                </Typography>
                                            </div>
                                            <div style={{ display: "inline-block" }}>
                                                <InputLabel className={classes.inputTitle}>
                                                    <b>Resolutie:</b>
                                                </InputLabel>
                                                <Typography
                                                    className={classes.title2}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    <TextField
                                                        id="standard-basic"
                                                        value={config?.resolution}
                                                        onInput={e => this.configuration.resolution = e.target.value}
                                                        disabled
                                                    />
                                                </Typography>
                                            </div>
                                            <div style={{ display: "inline-block" }}>
                                                <InputLabel className={classes.inputTitle}>
                                                    <b>Framerate:</b>
                                                </InputLabel>
                                                <Typography
                                                    className={classes.title2}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    <TextField
                                                        id="standard-basic"
                                                        value="30fps"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </Typography>
                                            </div>
                                            <InputLabel className={classes.inputTitle}>
                                                <b>Url:</b>
                                            </InputLabel>
                                            <Typography
                                                className={classes.title}
                                                color="textSecondary"
                                                gutterBottom
                                            >
                                                <TextField
                                                    className={classes.textField}
                                                    id="standard-basic"
                                                    value={this.state.value}
                                                    onChange={this.handleChange}
                                                    disabled
                                                />
                                            </Typography>
                                            <InputLabel className={classes.inputTitle}>
                                                <b>Selecteer Detecties</b>
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                className={classes.autoComplete}
                                                id="fixed-tags-demo"
                                                defaultValue={this.state.fixedOptions}
                                                onChange={this.onChange}
                                                options={Detections}
                                                renderTags={(tagValue, getTagProps) =>
                                                    tagValue.map((option, index) => (
                                                        <Chip
                                                            color="primary"
                                                            label={option}
                                                            {...getTagProps({ index })}
                                                        // onDelete={this.state.fixedOptions.indexOf(option) !== -1}
                                                        >{option.detection}</Chip>
                                                    ))
                                                }
                                                style={{ width: 500 }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="standard" />
                                                )}
                                            />
                                            <InputLabel className={classes.inputTitle}>
                                                <b>Detectie Opties</b>
                                            </InputLabel>
                                            <FormControl
                                                component="fieldset"
                                                className={classes.formControl}
                                            >
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={D}
                                                                onChange={this.handleChange}
                                                                name="D"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Directions"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={BB}
                                                                onChange={this.handleChange}
                                                                name="BB"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Boundary Boxes"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={CLC}
                                                                onChange={this.handleChange}
                                                                name="CLC"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Calculate Line Cross"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={CO}
                                                                onChange={this.handleChange}
                                                                name="CO"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Count Objects"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={SOS}
                                                                onChange={this.handleChange}
                                                                name="SOS"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Show object speed"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={VC}
                                                                onChange={this.handleChange}
                                                                name="VC"
                                                                style={{
                                                                    color: "#4D9D2A"
                                                                }}
                                                            />
                                                        }
                                                        label="Visualize Centers"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        className={classes.Buttons}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Link to="/" style={{ textDecoration: 'none' }}>
                                                        <Button
                                                            variant="contained"
                                                            color="default"
                                                            className={classes.Buttons}
                                                            
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Link>
                                                </FormGroup>
                                            </FormControl>
                                        </Box>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h3" className={classes.title}>
                                Camera Preview
                    </Typography>
                            <img src={(this.SnapshotAvailable()) ? this.FetchBlobPreview() : OfflinePlaceholder}/>
                            <Canvas width={1280} height={720} onDrawablesRecieve={this.handleDrawables} snapshot={this.props.snapshots.find(x => x.feed_id == this.props.match.params.id)?.snapshot}/>
                        </Grid>
                    </Grid>
                }
            </div>
        );
    };
}

export default withRouter(connect(mapStateToProps, mapDispatch)(withStyles(useStyles)(Configuration)))

