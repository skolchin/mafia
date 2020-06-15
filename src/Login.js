import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';

import Backend from './backend';
import InfoBar from './InfoBar';
import LoginDlg from './LoginDlg';

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
  },
  cardRoot: {
    maxWidth: 400,
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  cardContent: {
    //flex: '0 1 auto',
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  cardActions: {
    //flex: '1 1 auto',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },

}));

export default function Login() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const qs = Backend.getQuery(useLocation()); 

  const initialState = {
    drawerOpen: true,
    isNewUser: false,
    isSubmitting: false,
    errorMessage: null
  };
  const [data, setData] = React.useState(initialState);
  
  const handleDrawerOpen = () => {
    setData({ ...data, drawerOpen: true });
  };
  const handleDrawerClose = () => {
    setData({ ...data, drawerOpen: false });
  };
  const handleLoginClose = (user_id) => {
    const base_url = qs.back ? '/' + qs.back : '/';
    const uri = user_id ? '?user_id=' + user_id : '';
    history.push(base_url + uri);
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
        <List>
          <ListItem button key="new" disabled={data.isSubmitting}>
            <ListItemIcon>
              {data.isSubmitting ? <CircularProgress /> : <VpnKeyOutlined />}
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
    </Drawer>

    <main
      className={clsx(classes.content, {
        [classes.contentShift]: data.drawerOpen,
      })}
    >
    <LoginDlg open={true} onClose={handleLoginClose} />
    <InfoBar open={Boolean(data.errorMessage)} 
      severity = 'error'
      message = {data.errorMessage}
      autoHide = {3000}
      onClose = {handleErrorClose}
      />
    </main>

  </div>
  );
}

