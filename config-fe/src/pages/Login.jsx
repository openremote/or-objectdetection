import React from "react";
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Link,
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    loginform: {
        justifycontent: 'center',
        height: "75%"
    },
    buttonblock: {
        width: "100%",
    },
    loginbackground:
    {
        justifycontent: "center",
        minheight: "30vh",
        padding: 50,
        width: 400,
        height: 500,

    },
    title1: {
        marginBottom: 40,
    },
    container: {
        top: "40%",
        marginTop: "10%",
    }
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", authflag: 1 };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ username: event.state.username, password: event.state.password });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.username === 'admin@littech.in' && this.state.password === 'secret') {
            this.props.history.push("/home");
        } else {
            alert('Incorrect Credntials!');
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container className={classes.container} spacing={0} justify="center" direction="row">
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            spacing={2}
                            className={classes.loginform}
                            paddingTop={100}
                        >
                            <Paper
                                variant="elevation"
                                elevation={2}
                                className={classes.loginbackground}
                            >
                                <Grid item className={classes.title1}>
                                    <Typography component="h1" variant="h4" align="center">
                                        Login
                                </Typography>
                                </Grid>
                                <Grid item>
                                    <form onSubmit={this.handleSubmit}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item>
                                                <TextField
                                                    type="email"
                                                    placeholder="Email"
                                                    fullWidth
                                                    name="username"
                                                    variant="outlined"
                                                    value={this.state.username}
                                                    onChange={(event) =>
                                                        this.setState({
                                                            [event.target.name]: event.target.value,
                                                        })
                                                    }
                                                    required
                                                    autoFocus
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    placeholder="Wachtwoord"
                                                    fullWidth
                                                    name="password"
                                                    variant="outlined"
                                                    value={this.state.password}
                                                    onChange={(event) =>
                                                        this.setState({
                                                            [event.target.name]: event.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    className={classes.buttonblock}
                                                    href="/"
                                                >
                                                    Inloggen
</Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Wachtwoord vergeten?
</Link>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        );
    }
}
export default withStyles(useStyles)(Login);