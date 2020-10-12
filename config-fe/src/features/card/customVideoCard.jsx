import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Card, CardHeader, Avatar, CardMedia, CardContent, IconButton, CardActions } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

//icons
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import logo from 'assets/office.jpg';

//custom component imports
import AvatarIcon from './avatarIcon';
import { Link } from 'react-router-dom';

const styles = theme => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: green[500],
    },
});

class customVideoCard extends React.Component {
    render() {
        const classes = this.props.classes;
        return(
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar}>
                            <AvatarIcon SourceType={this.props.SourceType}/> 
                        </Avatar>
                    }
                    titleTypographyProps={{variant:'h6' }}
                    title={this.props.SourceName}
                    subheader={this.props.SubName}
                />
                <CardMedia
                    className={classes.media}
                    image={logo}
                    title="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.Descripton}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <Link to={'/configuration/' + this.props.Id}>
                            <EditIcon color="primary" />
                        </Link>
                    </IconButton>
                    <IconButton aria-label="share">
                        <Link to={'/feed/' + this.props.Id}>
                            <VisibilityIcon color="primary"/>
                        </Link>
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

customVideoCard.propTypes = {
    Id: PropTypes.string,
    SourceName: PropTypes.string,
    SubName: PropTypes.string,
    Descripton: PropTypes.string,
    SourceType: PropTypes.string

};

export default withStyles(styles, { withTheme: true })(customVideoCard);