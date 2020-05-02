import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { AuthContext } from './auth_reducer';
import Backend from './backend';
import MsgBox from './MsgBox';

export function Login(props) {
    const [state, dispatch] = React.useContext(AuthContext);
    const [toastOpen, setToastOpen] = React.useState(false);

    const initialState = {
      login: "",
      password: "",
      isSubmitting: false,
      errorMessage: null
    };
    const [data, setData] = React.useState(initialState);
  
    const handleChange = name => event => {
      setData({ ...data, [name]: event.target.value, errorMessage: null });
      setToastOpen(false);
    };
    const handleLogin = () => {
      setData({
        ...data,
        isSubmitting: true
      })
      Backend.loginUser(data)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(resJson => {
        if (resJson['token']) {
          // OK
          dispatch({
              type: "LOGIN",
              payload: resJson
          })
          handleClose(false);
        }
        else if (!resJson['user_id']) {
          // User not found
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
          />
          <TextField
            margin = "dense"
            disabled={data.isSubmitting} 
            id = "password"
            label = "Password"
            type = "password"
            fullWidth
            onChange = {handleChange("password")}
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

        <MsgBox open={toastOpen} 
          severity = 'info'
          message = {'Login ' + data.login + ' not found. Register?'}
          action = "OK"
          onClose = {setToastOpen}
          onClick = {handleNewUser}
          />

        <MsgBox open={data.errorMessage} 
          severity = 'error'
          message = {data.errorMessage}
          autoHide = {3000}
          onClose = {handleErrorClose}
          />
      </Dialog>
    );
}

export default withMobileDialog()(Login);
