import React from 'react';
import { useCookies } from 'react-cookie';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';

import AccountCircle from '@material-ui/icons/AccountCircle';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Block from '@material-ui/icons/Block';
import Adjust from '@material-ui/icons/Adjust';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { AuthContext } from './auth_reducer';
import { GameListContext } from './game_list_reducer';
import { GameDisplayMap } from './dict';
import Backend from './backend';
import Login from './Login';
import GameCard from './GameCard';
import MsgBox from './MsgBox';

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

export default function GameDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [drawerOpen, setOpen] = React.useState(true);
  const [auth, authDispatch] = React.useContext(AuthContext);
  const [gameList, gameListDispatch] = React.useContext(GameListContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const menuOpen = Boolean(anchorEl);
  const [, setCookie, removeCookie] = useCookies(['token']);

  const initialState = {
    selected: -1,
    isSubmitting: false,
    errorMessage: null
  };
  const [data, setData] = React.useState(initialState);

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
    setData({
      ...data,
      isSubmitting: true
    })
    Backend.newGame(auth)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then(resJson => {
      gameListDispatch({
          type: "NEW_GAME",
          payload: resJson
      })
    })
    .catch(error => {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message || error.statusText
      });
    });
  }
  const handleGameSel = (index) => {
    setData({
      ...data,
      selected: index,
    })
  }
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
    Backend.logoutUser(auth);
    setCookie('token', null, { path: '/' });
    removeCookie('token', { path: '/' })
    authDispatch({type: 'LOGOUT', payload: auth,})
  }
  const handleErrorClose = () => {
    setData({...data, errorMessage: null});
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
            Mafia!
          </Typography>
          <div>
            <Tooltip title={(auth && auth.login ? auth.name : "Not logged in")}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {auth.login
                ? (<Avatar color="inherit" src={Backend.avatarURL(auth)} className={classes.appBarAvatar}>
                    {!auth.has_avatar ? Backend.nameInitials(auth) : null}
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
          {auth.login && (
            <List>
              <ListItem button key="new" disabled={data.isSubmitting} onClick={handleNewGame}>
                <ListItemIcon>
                  {data.isSubmitting ? (<CircularProgress/>) : (<AddCircleOutline />)}
                </ListItemIcon>
                <ListItemText primary="New game" />
              </ListItem>

              {gameList.games.map((item, index) => (
                <ListItem button key={item.id} disabled={data.isSubmitting} onClick={(e) => handleGameSel(index)}>
                  <ListItemIcon>
                    {item.status !== "finish"
                      ? (<Adjust />)
                      : (<Block />)
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={GameDisplayMap["state"][item.status]}
                  />
                </ListItem>
              ))}
            </List>
          )}
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        {auth.login && data.selected >= 0 && (
          <GameCard game={gameList.games[data.selected]} />
        )}
      </main>

      <Login open={loginOpen} onClose={setLoginOpen} />
      <MsgBox open={data.errorMessage} 
          severity = 'error'
          message = {data.errorMessage}
          autoHide = {3000}
          onClose = {handleErrorClose}
          />
    </div>
  );
}
