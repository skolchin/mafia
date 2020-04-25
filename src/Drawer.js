import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tooltip from  '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircle from '@material-ui/icons/AccountCircle';
import AddOutlined from '@material-ui/icons/AddOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { AuthContext } from './auth';
import { GameContext } from './game';
import Login from './Login';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerTitle: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  appBarAvatar: {
    marginLeft: 'auto',
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

export default function GameDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [drawerOpen, setOpen] = React.useState(true);
  const [auth, authDispatch] = React.useContext(AuthContext);
  const [game, gameDispatch] = React.useContext(GameContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNewGame = () => {
    gameDispatch({ type: 'NEW_GAME', payload: {user: auth}});
  };
  const handleLogin = () => {
    setLoginOpen(true);
    handleMenuClose();
  }
  const handleProfile = () => {
    handleMenuClose();
    authDispatch({type: 'PROFILE', payload: auth,})
  }
  const handleLogout = () => {
    handleMenuClose();
    authDispatch({type: 'LOGOUT', payload: auth,})
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap  className={classes.drawerTitle}>
            Mafia!!!
          </Typography>
          <div>
            <Tooltip title={(auth && auth.login ? auth.name : "")}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {auth.avatar || auth.name 
                ? (
                  <Avatar 
                    src={auth.avatar ? process.env.PUBLIC_URL + '/' + auth.avatar : ""} 
                    className={classes.appBarAvatar}
                  >
                    {(!auth.avatar ? auth.name[0].toUpperCase() : null)} 
                  </Avatar>
                  )
                : (
                  <Avatar color="inherit" className={classes.appBarAvatar}>
                    <AccountCircle />
                  </Avatar>
                )
                }
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              {!auth.login && (
                <MenuItem onClick={handleLogin}>
                  Login
                </MenuItem>
              )}
              {auth.login && (
                <MenuItem onClick={handleProfile}>
                  Profile
                </MenuItem>
              )}
              {auth.login && (
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              )}
              </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key="new_game" onClick={handleNewGame}>
            <ListItemIcon><AddOutlined /></ListItemIcon>
            <ListItemText primary="New game" />
          </ListItem>
        </List>
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <Typography>Here we would have members</Typography>
      </main>

      <Login open={loginOpen} onClose={setLoginOpen} />
    </div>
  );
}
