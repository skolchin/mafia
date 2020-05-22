import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import AccountCircle from '@material-ui/icons/AccountCircle';

import { AppContext } from './app_context';
import Backend from './backend';
import InfoBar from './InfoBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  header: {
    alignItems: "left",
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    height: 300,
    padding: theme.spacing(1),
  },
  tabsPanel: {
    padding: 0,
  },
  avatar_large: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },  
  cardContent: {
    flex: '1 0 auto',
    flexGrow: 1,
    paddingBottom: theme.spacing(4),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Profile(props) {
  const classes = useStyles();
  const history = useHistory();
  const {match: {params}} = props.args === undefined ? {match: {params:{user_id: null}}} : props.args
  const {user_id} = params;
  const [state, dispatch] = React.useContext(AppContext);

  const initialState = {
    user: null,
    section: 0,
    isSubmitting: false,
    errorMessage: null,
  }
  const [data, setData] = React.useState(initialState);

  const handleChange = name => event => {
    setData({...data, user: {...data.user, [name]: event.target.value}});
  };
  const handleTabChange = (event, value) => {
    setData({...data, section: value});
  };
  const handleCancel = () => {
    history.push('/');
  };
  const handleErrorClose = () => {
    setData({...data, errorMessage: null});
  }
  const handleSave = () => {
    setData({
      ...data,
      isSubmitting: true
    });
    Backend.fetch(
      Backend.USER_URL, 
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify(data.user),
      },
      ((resJson) => {
        setData({
          ...data,
          isSubmitting: false,
        });
        dispatch({
          type: 'LOGIN',
          payload: resJson
        });
      }),
      ((error) => {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error,
        });
      })
    )
  };

  useEffect(() => {
    if (!data.user && user_id && user_id === state.user._id) {
      setData({...data, user: {...state.user, new_password: state.user.password}});
    }
    else if (!data.user && user_id) {
      //TODO
    }
  }, [user_id, state, data, setData]);

  //if (user_id && !data.user)
  //  return (<Box />)
  //else 
  return (
    <div className={classes.root}>
      <Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" align="left" className={classes.header}>User profile</Typography>

            <div className={classes.content}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={data.section}
                onChange={handleTabChange}
                aria-label="Profile"
                className={classes.tabs}
              >
                <Tab label="Basic Info" {...a11yProps(0)} />
                <Tab label="Avatar" {...a11yProps(1)} />
                <Tab label="Security" {...a11yProps(2)} />
              </Tabs>

              <TabPanel value={data.section} index={0} className={classes.tabPanel}>
                <TextField
                  autoFocus
                  disabled={data.isSubmitting} 
                  required
                  value={data.user ? data.user.name : null}
                  id = "name"
                  label = "Login name"
                  variant="outlined"
                  helperText="Enter login name or email address"
                  onChange = {handleChange("name")} />

                <TextField
                  disabled={data.isSubmitting} 
                  value={data.user ? data.user.displayName : null}
                  id = "displayName"
                  label = "Display name"
                  variant="outlined"
                  helperText="Enter a name to be displayed to others"
                  onChange = {handleChange("displayName")} />
                  <br />

                <TextField
                  disabled={data.isSubmitting} 
                  value={data.user ? data.user.givenName : null}
                  id = "givenName"
                  label = "First name"
                  variant="outlined"
                  helperText="Enter first (given) name"
                  onChange = {handleChange("givenName")} />

                <TextField
                  disabled={data.isSubmitting} 
                  value={data.user ? data.user.familyName : null}
                  id = "familyName"
                  label = "Last name"
                  variant="outlined"
                  helperText="Enter last (family) name"
                  onChange = {handleChange("familyName")} />
                  <br />
              </TabPanel>

              <TabPanel value={data.section} index={1}>
                <IconButton>
                  <Avatar className={classes.avatar_large}>
                    <AccountCircle style={{ fontSize: 40 }} />
                  </Avatar>
                </IconButton>
                <Typography variant="body2" color="textSecondary">Click to upload an avatar picture</Typography>
              </TabPanel>

              <TabPanel value={data.section} index={2}>
                <TextField
                  disabled={true} 
                  value={data.user ? data.user.password : null}
                  id = "password"
                  label = "Current password"
                  type = "password"
                  variant="outlined"
                  InputProps={{readOnly: true, }}
                />

                <TextField
                  autoFocus
                  disabled={data.isSubmitting} 
                  required
                  value={data.user ? data.user.new_password : null}
                  id = "new_password"
                  label = "New password"
                  type = "password"
                  variant="outlined"
                  helperText="Enter new password"
                  onChange = {handleChange("new_password")} />
            </TabPanel>
            </div>
          </CardContent>

          <CardActions>
            <Button color="primary" disabled={data.isSubmitting} onClick={handleSave}>
              {data.isSubmitting
                ? (<CircularProgress/>)
                : (data.user && data.user._id ? 'Save' : 'Create') 
              }
            </Button>
            <Button color="primary" disabled={data.isSubmitting} onClick={handleCancel}>
              Close
            </Button>
          </CardActions>
        </Card>

        <InfoBar open={Boolean(data.errorMessage)} 
          severity = 'error'
          message = {data.errorMessage}
          autoHide = {3000}
          onClose = {handleErrorClose}
        />
      </Box>
    </div>
  );
}
