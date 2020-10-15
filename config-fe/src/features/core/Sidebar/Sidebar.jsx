import React from 'react';
import clsx from 'clsx';
import { asyncComponent } from 'react-async-component'
import { Link} from 'react-router-dom';

//material ui stuff
import { Drawer, List, Divider, ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles  } from '@material-ui/core/styles';

import SidebarItems from './SidebarItems.json'

//create css using material ui css helper, since we need some theme values. 
const drawerWidth = 215;
const styles = theme => ({
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.up('sm')]: {
      height: "62px"
    },
    [theme.breakpoints.down('xs')]: {
      height: "54px"
    },
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  HamburgerStart: {
    alignSelf: 'start'
  },
  HamburgerEnd: {
    marginRight: '0px'
  },
  
});

//Fetches material icon async based on the name of the icon given in the sidebaritems.json
const MaterialIconAsync = ({ icon }) => {
    let iconName = icon.replace(/Icon$/, '')
    return React.createElement(asyncComponent({
        resolve: () => import(
            /* webpackMode: "eager" */
            `@material-ui/icons/${iconName}`)
    }))
}   

class SideBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true
      };
    }

    handleDrawerChange = () => {
      this.setState({ open: !this.state.open });
    }

    render() {
        const { classes } = this.props;
        return(
          <Drawer
            color="primary"
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: clsx(classes.drawerPaper, {
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
            anchor="left"
          >
            <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerChange}
            className={clsx(classes.menuButton, {
              [classes.HamburgerStart]: this.state.open,
              [classes.HamburgerEnd]: !this.state.open,
            }) }
            >
              <MenuIcon />
            </IconButton>
            <Divider />
            <List>
              {SidebarItems.data.map((item, index) => (
                <Link key={item.name} to={item.url} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                  <ListItem button key={item.name}>
                    <ListItemIcon> <MaterialIconAsync icon={item.icon}/>  </ListItemIcon>
                    <ListItemText primary={item.name}/>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
        )
    }
}

export default withStyles(styles, {withTheme: true})(SideBar);