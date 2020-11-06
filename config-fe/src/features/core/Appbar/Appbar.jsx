import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom'
import { TrackChanges } from '@material-ui/icons';
import { connect } from 'react-redux';

import { logout } from "../../../store/modules/auth/authSlice";

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        width: "100px"
    }
});

class Appbar extends React.Component {

    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);

        this.state = {
            user: null,
            loginVisible: true,
            logoutVisible: false
        }
    }

    handleLoginClick() {
        this.props.history.push('/login')
    }

    handleLogoutClick() {
        this.props.dispatch(logout(this.props.history))
    }

    render() {
        const { classes } = this.props;
        let button;

        if (this.props.authenticated) {
            button = <Button id="logoutButton" color="inherit" onClick={this.handleLogoutClick} >Uitloggen</Button>
        }
        else {
            button = <Button id="loginButton" color="inherit" onClick={this.handleLoginClick}>Login</Button>
        }

        return (
            <AppBar position="sticky" color="primary" className={classes.AppBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        OpenRemote
                    </Typography>

                    {button}

                </Toolbar>
            </AppBar>
        )
    }
}



const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Appbar)))

