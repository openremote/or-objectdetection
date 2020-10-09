import React from 'react';

import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles  } from '@material-ui/core/styles';

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
    render() {
        const { classes } = this.props;
        return(
            <AppBar position="sticky" color="default" className={classes.AppBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        OpenRemote
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Appbar);