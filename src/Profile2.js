import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { AppContext } from './app_context';
import Backend from './backend';
import InfoBar from './InfoBar';

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
  cardRoot: {
    maxWidth: 400,
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    alignItems: 'left',
  },
  cardActions: {
    //flex: '1 1 auto',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  avatarLarge: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },  
}));

export default function Profile() {
  const classes = useStyles();
  const theme = useTheme();
  const [state, dispatch] = React.useContext(AppContext);
  const [, setCookie] = useCookies(['token']);
  const history = useHistory();
  const qs = Backend.getQuery(useLocation()); 

  const initialState = {
    user: null,
    tab: 'main',
    photo_url: null,
    drawerOpen: true,
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
  const handleChange = name => event => {
    setData({
      ...data, 
      [name]: event.target.value, errorMessage: null
    });
  };
  const handleClose = () => {
    setData({...data, isNewUser: false, errorMessage: null});
    history.push(qs.back ? '/' + qs.back : '/');
  }
  const handleErrorClose = () => {
    setData({...data, errorMessage: null});
  }
  const handleMainTabOpen = () => {
    setData({ ...data, tab: 'main' });
  };
  const handlePhotoTabOpen = () => {
    setData({ ...data, tab: 'photo' });
  };
  const handleUpload = (event) => {
    setData({...data, isSubmitting: true, });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = (e) => {
      Backend.post(
        Backend.PHOTO_URL, 
        {user_id: data.user._id, photo: e.target.result},
        ((resJson) => {
          setData({...data, isSubmitting: false, photo_url: Backend.avatarURL(state.user) + '&p=1'});
        }),
        ((error) => {
          setData({...data, isSubmitting: false, errorMessage: error});
        })
      )
    };
  }
  const handleSave = () => {
    setData({...data, isSubmitting: true });
    Backend.post(
      Backend.USER_URL, 
      data.user,
      ((resJson) => {
        setData({...data, user: resJson.user, isSubmitting: false, });
        dispatch({type: 'LOAD', payload: resJson});
      }),
      ((error) => {
        setData({...data, isSubmitting: false, errorMessage: error});
      })
    )
  };

  useEffect(() => {
    if (!data.user && qs.user_id && qs.user_id === state.user._id) {
      // Current authenticated user
      setData({...data, user: {...state.user, new_password: ''}, photo_url: Backend.avatarURL(state.user)});
    }
    else if (!data.user && qs.user_id) {
      // Refresh or bookmark - do login
      history.push('/login?back=profile')
    }
  }, [qs, state, data, setData, history]);

  if (qs.user_id && !data.user)
    return null;
  else 
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
            <ListItem button key="main" disabled={data.isSubmitting} onClick={handleMainTabOpen}>
              <ListItemIcon>
                {data.isSubmitting ? <CircularProgress /> : <AccountCircleOutlined />}
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button key="photo" disabled={data.isSubmitting} onClick={handlePhotoTabOpen}>
              <ListItemIcon>
                {data.isSubmitting ? <CircularProgress /> : <FaceOutlined />}
              </ListItemIcon>
              <ListItemText primary="Avatar" />
            </ListItem>
          </List>
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: data.drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <Card className={classes.cardRoot}>
          {data.tab === 'main' 
            ? (
              <CardContent className={classes.cardContent}>
                <Typography variant="body" color="textSecondary" style={{marginBottom: theme.spacing(3)}}>
                    Fill all form fields and press SAVE
                  </Typography>

                  <TextField
                    autoFocus
                    disabled={data.isSubmitting} 
                    required
                    value={data.user ? data.user.name : null}
                    id = "name"
                    label = "Login name"
                    helperText="Enter login name or email address"
                    margin = "dense"
                    onChange = {handleChange("name")} />
                  <TextField
                    disabled={data.isSubmitting} 
                    value={data.user ? data.user.displayName : null}
                    id = "displayName"
                    label = "Display name"
                    helperText="Enter a name to be displayed to others"
                    margin = "dense"
                    onChange = {handleChange("displayName")} />
                  <TextField
                    disabled={data.isSubmitting} 
                    value={data.user ? data.user.givenName : null}
                    id = "givenName"
                    label = "First name"
                    margin = "dense"
                    helperText="Enter first (given) name"
                    onChange = {handleChange("givenName")} />
                  <TextField
                    disabled={data.isSubmitting} 
                    value={data.user ? data.user.familyName : null}
                    id = "familyName"
                    label = "Last name"
                    helperText="Enter last (family) name"
                    margin = "dense"
                    onChange = {handleChange("familyName")} />
                  <TextField
                    disabled={data.isSubmitting}  
                    value={data.user ? data.user.email : null}
                    id = "email"
                    label = "email"
                    type = "email"
                    margin = "dense"
                    helperText="Enter email address"
                  />
                  <TextField
                    disabled={data.isSubmitting} 
                    value={data.user ? data.user.new_password : null}
                    required={!Boolean(data.user && data.user._id)}
                    id = "new_password"
                    label = "New password"
                    type = "password"
                    helperText="Enter new password if you wish to change it"
                    onChange = {handleChange("new_password")} />
              </CardContent>
            )
            : (
              <CardContent className={classes.cardContent}>
                <Typography variant="body" color="textSecondary" style={{marginBottom: theme.spacing(3)}}>
                    Click to change avatar picture
                  </Typography>
                  <input
                    accept="image/*"
                    style={{display: 'none'}}
                    id="icon-button-photo"
                    onChange={handleUpload}
                    type="file"
                  />
                  <label htmlFor="icon-button-photo">
                    <IconButton component="span">
                      <Avatar color='inherit' src={data.photo_url} className={classes.avatarLarge}>
                        <AccountCircle style={{ fontSize: 60 }} />
                      </Avatar>
                    </IconButton>
                  </label>
              </CardContent>
            )
          }

          <CardActions classname={classes.cardActions}>
            <Button color="primary" disabled={data.isSubmitting} onClick={handleSave}>
              {data.isSubmitting
                ? (<CircularProgress/>)
                : ('Save')
              }
            </Button>
            <Button color="primary" disabled={data.isSubmitting} onClick={handleClose}>
              Close
            </Button>
          </CardActions>

          <InfoBar open={Boolean(data.errorMessage)} 
            severity = 'error'
            message = {data.errorMessage}
            autoHide = {3000}
            onClose = {handleErrorClose}
            />
        </Card>
      </main>
    </div>
    );
}

