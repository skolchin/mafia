import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tooltip from  '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import BlockOutlined from '@material-ui/icons/BlockOutlined';
import AccessTimeOutlined from '@material-ui/icons/AccessTimeOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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