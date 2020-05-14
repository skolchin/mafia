import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Tooltip from  '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

import Backend from './backend';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  normal: {
    marginLeft: 'auto',
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },  
}));

export default function PersonName(props) {
    const classes = useStyles();
    const avatarClass = props.size === 'small' ? classes.small : classes.normal;
    const altTooltip = props.altTooltip || "Not logged in";

    return (
        <Tooltip title={props.user && props.user.user_id ? props.user.name : altTooltip}>
            {props.user && props.user.user_id
                ? (
                    <Avatar color="inherit" src={Backend.avatarURL(props.user)} className={avatarClass}>
                        {Backend.nameInitials(props.user)}
                    </Avatar>
                )
                : (
                <Avatar color="inherit" className={avatarClass}>
                    <AccountCircle />
                </Avatar>
                )}
        </Tooltip>
    )
}

PersonName.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string,
  altTooltip: PropTypes.string,
}
