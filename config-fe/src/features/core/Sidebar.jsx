import React from 'react';
import { asyncComponent } from 'react-async-component'
import { Link} from 'react-router-dom';
//material ui stuff
import { Drawer, List, Divider, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
//Custom styles
import styles from './Sidebar.module.css';
import SidebarItems from './SidebarItems.json'

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
    render() {
        return(
            <Drawer
            className={styles.Drawer}
            variant="permanent"
            classes={{
              paper: styles.drawerPaper,
            }}
            anchor="left"
          >
            <Divider />
            <List>
              {SidebarItems.data.map((item, index) => (
                <ListItem button key={item.name}>
                  <ListItemIcon><MaterialIconAsync icon={item.icon}/></ListItemIcon>
                  <ListItemText primary={item.name}>
                    <Link to={item.url} />
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Drawer>
        )
    }
}

export default SideBar;