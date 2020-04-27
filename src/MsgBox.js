import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function MessageBox(props) {
  const classes = useStyles();
  const _props = {
    ...props,
    severity: props.severity || "info",
    message: props.message || "",
    ok: props.ok || "OK",
  }
    
  return (
    <div className={classes.root}>
      <Snackbar 
        open={_props.open} 
        autoHideDuration={_props.autoHide} 
        onClick={() => _props.onClose(false)}
        onClose={() => _props.onClose(false)}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          severity={_props.severity} 
          action={
            (_props.action && (
              <Button color="inherit" size="small" onClick={() => _props.onClick()}>
                {_props.action}
              </Button>
            ))
          }
        >
          {_props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
