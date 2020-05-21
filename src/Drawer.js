import React from 'react';
import { useCookies } from 'react-cookie';
import clsx from 'clsx';
import { useHistory } from "react-router-dom";

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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import NotificationsIcon from '@material-ui/icons/Notifications';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import BlockOutlined from '@material-ui/icons/BlockOutlined';
import AccessTimeOutlined from '@material-ui/icons/AccessTimeOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { AppContext } from './app_context';
import Backend from './backend';
import Login from './Login';
import GameCard from './GameCard';
import NewGameCard from './NewGameCard';
import InfoBar from './InfoBar';
import PersonName from './PersonName';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  padded: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
}));

export default function GameDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [state, dispatch] = React.useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const [, setCookie, removeCookie] = useCookies(['token']);

  const initialState = {
    drawerOpen: true,
    loginOpen: false,
    isSubmitting: false,
    filterStates: ['new', 'start'],
    errorMessage: null,
  };
  const [data, setData] = React.useState(initialState);

  const handleDrawerOpen = () => {
    setData({ ...data, drawerOpen: true });
  };
  const handleDrawerClose = () => {
    setData({ ...data, drawerOpen: false });
  };
  const handleLoginOpen = () => {
    setData({ ...data, loginOpen: true });
    handleMenuClose();
  }
  const handleLoginClose = () => {
    setData({ ...data, loginOpen: false });
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileOpen = () => {
    handleMenuClose();
    history.push('/profile/' + state.user._id);
  }
  const handleErrorClose = () => {
    setData({ ...data, errorMessage: null });
  }
  const handleInfoClose = () => {
    dispatch({ type: 'HIDE_MESSAGE', payload: null });
  }
  const showNewGames = () => {
    setData({ ...data, filterStates: ['new', 'start'] });
  }
  const showActiveGames = () => {
    setData({ ...data, filterStates: ['active'] });
  }
  const showArchiveGames = () => {
    setData({ ...data, filterStates: ['finish'] });
  }
  const handleLogout = () => {
    handleMenuClose();
    fetch(Backend.AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        a: "logout",
        user_id: state.user._id,
        token: state.user.token
      })
    })
    setCookie('token', null, { path: '/' });
    removeCookie('token', { path: '/' })
    dispatch({ type: 'LOGOUT', payload: state.user })

    if (Backend.eventSource) {
      Backend.eventSource.close();
      Backend.eventSource = null;
    }
  }
  const handleErrror = (error) => {
    setData({ ...data, errorMessage: error });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: data.drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, data.drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.drawerTitle}>
            Mafia!
          </Typography>
          <div>
            <IconButton aria-label="notifications" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <PersonName user={state.user} disableProfile showName />
            </IconButton>

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
              {!state.user._id && (
                <MenuItem onClick={handleLoginOpen}>
                  Login
                </MenuItem>
              )}
              {state.user._id && (
                <MenuItem onClick={handleProfileOpen}>
                  Profile
                </MenuItem>
              )}
              {state.user._id && (
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
        open={data.drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {state.user._id && (
          <List>
            <ListItem button key="new" disabled={data.isSubmitting} onClick={showNewGames}>
              <ListItemIcon>
                {data.isSubmitting ? <CircularProgress /> : <AddCircleOutline />}
              </ListItemIcon>
              <ListItemText primary="New & starting games" />
            </ListItem>
            <ListItem button key="active" disabled={data.isSubmitting} onClick={showActiveGames}>
              <ListItemIcon>
                {data.isSubmitting ? <CircularProgress /> : <AccessTimeOutlined />}
              </ListItemIcon>
              <ListItemText primary="Active games" />
            </ListItem>
            <ListItem button key="archive" disabled={data.isSubmitting} onClick={showArchiveGames}>
              <ListItemIcon>
                {data.isSubmitting ? <CircularProgress /> : <BlockOutlined />}
              </ListItemIcon>
              <ListItemText primary="Finished games" />
            </ListItem>
          </List>
        )}
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: data.drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container alignItems="stretch" justify="flex-start" >
          {state.user._id && data.filterStates.indexOf('new') >= 0 && (
            <Grid item key="new" className={classes.padded} >
              <NewGameCard onError={handleErrror} />
            </Grid>
          )}
          {state.user._id && (
            state.games.filter(game => data.filterStates.indexOf(game.status) >= 0).map((game, index) => (
              <Grid item key={index} className={classes.padded}>
                <GameCard game={game} onError={handleErrror} />
              </Grid>
            ))
          )}
        </Grid>

        <Login open={data.loginOpen} onClose={handleLoginClose} />
        <InfoBar open={Boolean(state.lastMessage)}
          severity='info'
          message={state.lastMessage}
          autoHide={3000}
          onClose={handleInfoClose}
        />
        <InfoBar open={Boolean(data.errorMessage)}
          severity='error'
          message={data.errorMessage}
          autoHide={3000}
          onClose={handleErrorClose}
        />

      </main>

    </div>
  );
}
