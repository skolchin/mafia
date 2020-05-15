import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';

import Backend from './backend';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  small: {
    marginLeft: 'auto',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    marginLeft: 'auto',
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  button_small: {
    display: 'inline-block',
    width: theme.spacing(3),
    height: theme.spacing(3),
    padding:0,
    minHeight: 0,
    minWidth: 0,
  },
  button_medium: {
    display: 'inline-block',
    width: theme.spacing(5),
    height: theme.spacing(5),
    padding:0,
    minHeight: 0,
    minWidth: 0,
  }
}));

export default function PersonName(props) {
  const classes = useStyles();
  const history = useHistory();
  const avatarClass = props.size === 'small' ? classes.small : classes.medium;
  const buttonClass = props.size === 'small' ? classes.button_small : classes.button_medium;
  const altTooltip = props.altTooltip || "Not logged in";

  const handleClick = () => {
    history.push('/profile/' + props.user.user_id.toString());
  }

  if (props.asChip) {
    const userName = props.user && props.user.user_id ? props.user.name : altTooltip;
    return (
      <Chip
        size={props.size}
        variant="outlined"
        avatar={
          props.user && props.user.user_id 
            ? (<Avatar color="inherit" src={Backend.avatarURL(props.user)} className={avatarClass} />)
            : (<Avatar color="inherit" className={avatarClass} />)
        }
        label={props.showName ? userName : ''}
        onClick={props.user && props.user.user_id && !props.disableProfile ? handleClick : null}
      />
    )
  }
  else {
    return (
      <Tooltip title={props.user && props.user.user_id ? props.user.name : altTooltip}>
        {props.user && props.user.user_id
          ? (
            props.disableProfile 
            ? (
              <Avatar color="inherit" src={Backend.avatarURL(props.user)} className={avatarClass}>
                {props.showName ? Backend.nameInitials(props.user) : <AccountCircle />}
              </Avatar>
            )
            : (
              <IconButton className={buttonClass} onClick={handleClick}>
                <Avatar color="inherit" src={Backend.avatarURL(props.user)} className={avatarClass}>
                  {props.showName ? Backend.nameInitials(props.user) : <AccountCircle />}
                </Avatar>
              </IconButton>
            )
          )
          : (
            <Avatar color="inherit" className={avatarClass}>
              <AccountCircle />
            </Avatar>
          )}
      </Tooltip>
    )
  }
}

PersonName.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string,
  altTooltip: PropTypes.string,
  asChip: PropTypes.bool,
  showName: PropTypes.bool,
  disableProfile: PropTypes.bool,
}
