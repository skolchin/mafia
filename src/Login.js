import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { AuthContext } from './auth_reducer';
import { backend } from './backend';
import MsgBox from './MsgBox';

export function Login(props) {
    const [state, dispatch] = React.useContext(AuthContext);
    const [toastOpen, setToastOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);

    const [values, setValues] = React.useState({
      login: '',
      password: ''
    })
    const handleChange = name => event => {
      setValues({ ...values, [name]: event.target.value });
      setToastOpen(false);
      setErrorOpen(false);
    };
    const handleLogin = () => {
      try {
        let userInfo = backend.loginUser(values);
        if (userInfo) {
          dispatch({
            type: 'LOGIN',
            payload: userInfo,
          });
          handleClose(false);
        }
        else {
          setToastOpen(true);
        }
      }
      catch (error) {
        setErrorOpen(true);
      }
    }
    const handleNewUser = () => {
      dispatch({
        type: 'PROFILE',
        payload: {
            login: values.login,
            token: values.password
        }
      })
    }
    const handleClose = () => {
      setToastOpen(false);
      setErrorOpen(false);
      props.onClose(false);
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
            margin = "dense"
            id = "login"
            label = "Email"
            type = "email"
            fullWidth
            onChange = {handleChange("login")}
          />
          <TextField
            margin = "dense"
            id = "password"
            label = "Password"
            type = "password"
            fullWidth
            onChange = {handleChange("password")}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>

        <MsgBox open={toastOpen} 
          severity = 'info'
          message = {'Login ' + values.login + ' not found. Register?'}
          action = "OK"
          onClose = {setToastOpen}
          onClick = {handleNewUser}
          />

        <MsgBox open={errorOpen} 
          severity = 'error'
          message = {'Login error, check your password and try again'}
          onClose = {setErrorOpen}
          />
      </Dialog>
    );
}

export default withMobileDialog()(Login);
