import React from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";

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
    const [, setCookie] = useCookies(['token']);
    const history = useHistory();

    const initialState = {
      login: "",
      password: "",
      isNewUser: false,
      isSubmitting: false,
      errorMessage: null
    };
    const [data, setData] = React.useState(initialState);
  
    const handleChange = name => event => {
      setData({
        ...data, 
        isNewUser: false,
        [name]: event.target.value, errorMessage: null
      });
    };
    const handleNewUser = () => {
      history.push('/profile/');
    }
    const handleClose = (user_id) => {
      setData({...data, isNewUser: false, errorMessage: null});
      props.onClose(user_id);
    }
    const handleCancel = () => {
      setData({...data, isNewUser: false, errorMessage: null});
      props.onClose(null);
    }
    const handleErrorClose = () => {
      setData({...data, errorMessage: null});
    }
    const handleInfoClose = () => {
      setData({...data, isNewUser: false});
    }
    const handleLogin = () => {
      setData({...data, isSubmitting: true})
      Backend.post(
        Backend.AUTH_URL,  
        {name: data.login, password: data.password, withGames: true, },
        ((resJson, token) => {
          dispatch({
            type: "LOAD",
            payload: resJson,
          })
          localStorage.setItem('token', token);
          Backend.createEventSource(window, dispatch, resJson.user._id);
          handleClose(resJson.user._id);
        }),
        ((error, error_code) => {
          if (error_code === 'USER_NOT_FOUND') 
            setData({...data, isSubmitting: false, isNewUser: true});
          else
            setData({...data, isSubmitting: false, errorMessage: error});
        })
      )
    }

    return (
      <Dialog 
        open={props.open}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your login name and password and press "LOGIN".
          </DialogContentText>
          <TextField
            autoFocus
            disabled={data.isSubmitting} 
            required
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
            required
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
          <Button color="primary" disabled={data.isSubmitting} onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>

        <InfoBar open={data.isNewUser} 
          severity = 'info'
          message = {'Login ' + data.login + ' not found. Register?'}
          action = "OK"
          onClose = {handleInfoClose}
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
