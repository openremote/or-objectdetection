import React from 'react';
import PropTypes from 'prop-types';

//core material UI components
import { Typography, Card, CardHeader, Avatar, CardMedia, CardContent, IconButton, CardActions } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

//icons
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import OfflinePlaceholder from 'assets/offline.png';

//custom component imports
import AvatarIcon from './avatarIcon';
import { Link } from 'react-router-dom';

const styles = theme => ({
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: green[500],
    },

});

class customVideoCard extends React.Component {
    FetchUrlObjectForBlob(blob) {
        if(blob) {
            let url = URL.createObjectURL(blob);
            return url;
        } else {
            return OfflinePlaceholder;
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar}>
                            <AvatarIcon SourceType={this.props.SourceType} />
                        </Avatar>
                    }
                    titleTypographyProps={{ variant: 'h6' }}
                    title={this.props.SourceName}
                    subheader={this.props.SubName}
                />
                <Link to={'/feed/' + this.props.Id}>
                    <CardMedia
                        className={classes.media}
                        image={(this.props.Active) ? this.FetchUrlObjectForBlob(this.props.Snapshot) : OfflinePlaceholder}
                        title="Paella dish"
                    />
                </Link>

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
                    {(this.props.Active) ?
                    <IconButton aria-label="Start" onClick={() => this.props.OnStartStop(this.props.Id)}>
                         <StopIcon/>
                    </IconButton>
                    :
                    <IconButton aria-label="Stop" onClick={() => this.props.OnStartStop(this.props.Id)}>
                        <PlayIcon/>
                    </IconButton>
                    }
                </CardActions>
            </Card>
        )
    }
}

customVideoCard.propTypes = {
    Id: PropTypes.number,
    SourceName: PropTypes.string,
    SubName: PropTypes.string,
    Descripton: PropTypes.string,
    SourceType: PropTypes.number,
    Active: PropTypes.bool,
    Snapshot: PropTypes.any,
    OnStartStop: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(customVideoCard);