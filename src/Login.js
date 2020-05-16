import React from 'react';
import { useCookies } from 'react-cookie';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { AppContext } from './app_context';
import Backend from './backend';
import InfoBar from './InfoBar';

export function Login(props) {
    const [, dispatch] = React.useContext(AppContext);
    const [toastOpen, setToastOpen] = React.useState(false);
    const [, setCookie] = useCookies(['token']);

    const initialState = {
      login: "",
      password: "",
      isSubmitting: false,
      errorMessage: null
    };
    const [data, setData] = React.useState(initialState);
  
    const handleChange = name => event => {
      setData({
        ...data, 
        [name]: event.target.value, errorMessage: null
      });
      setToastOpen(false);
    };
    const handleLogin = () => {
      setData({
        ...data,
        isSubmitting: true
      })
      fetch(Backend.AUTH_URL,  {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify({
            a: "login",
            login: data.login,
            password: data.password
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson => {
        if (resJson.user && resJson.user.token) {
          // OK
          dispatch({
              type: "LOAD",
              payload: resJson,
          })
          handleClose(false);
          setCookie('token', resJson.user.token, { path: '/' });

          if (!Backend.eventSource) {
            Backend.eventSource = new EventSource(Backend.MESSAGES_URL + '?user_id=' + resJson.user.user_id);
            const listener  = (e) => {
              console.log('New event');
              dispatch({
                type: e.type.toUpperCase(),
                payload: JSON.parse(e.data),
              })
            }
            Backend.eventSource.addEventListener('game_update', listener);
            Backend.eventSource.addEventListener('status_change', listener);
            Backend.eventSource.addEventListener('new_member', listener);

            window.addEventListener("beforeunload", (ev) => {
              ev.preventDefault();
              if (Backend.eventSource) {
                Backend.eventSource.close();
                Backend.eventSource = null;
              }
            })
          }
        }
        else if (!resJson.user_id) {
          // User not found
          setData({
            ...data,
            isSubmitting: false
          });
          setToastOpen(true);
        }
        else {
          // Wrong password
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: "Invalid password"
          });
        }
      })
      .catch(error => {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error.message || error.statusText
        });
      });
    }

    const handleNewUser = () => {
      dispatch({
        type: 'PROFILE',
        payload: data,
      })
    }
    const handleClose = () => {
      setToastOpen(false);
      setData({...data, errorMessage: null});
      props.onClose(false);
    }
    const handleErrorClose = () => {
      setData({...data, errorMessage: null});
    }

    return (
      <Dialog 
        open={props.open}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email and password and press "LOGIN".
          </DialogContentText>
          <TextField
            autoFocus
            disabled={data.isSubmitting} 
            margin = "dense"
            id = "login"
            label = "Email"
            type = "email"
            fullWidth
            onChange = {handleChange("login")}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                  handleLogin();
                  ev.preventDefault();
              }
            }}                    
          />
          <TextField
            margin = "dense"
            disabled={data.isSubmitting} 
            id = "password"
            label = "Password"
            type = "password"
            fullWidth
            onChange = {handleChange("password")}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                  handleLogin();
                  ev.preventDefault();
              }
            }}                    
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" disabled={data.isSubmitting} onClick={handleLogin}>
          {data.isSubmitting
             ? (<CircularProgress/>)
            : ('Login')
          }
          </Button>
          <Button color="primary" disabled={data.isSubmitting} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>

        <InfoBar open={Boolean(toastOpen)} 
          severity = 'info'
          message = {'Login ' + data.login + ' not found. Register?'}
          action = "OK"
          onClose = {setToastOpen}
          onClick = {handleNewUser}
          />

        <InfoBar open={Boolean(data.errorMessage)} 
          severity = 'error'
          message = {data.errorMessage}
          autoHide = {3000}
          onClose = {handleErrorClose}
          />
      </Dialog>
    );
}

export default withMobileDialog()(Login);
