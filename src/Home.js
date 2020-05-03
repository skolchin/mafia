import React from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from './auth_reducer';
import Backend from './backend';
import GameDrawer from './Drawer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
}))

export default function Home(props) {
    const classes = useStyles();
    const [state, dispatch] = React.useContext(AuthContext);
    const [cookies] = useCookies(['token']);
  
    const restoreSession = async () => {
      if (cookies.token && !state.login && !state.token) {
        const response = await Backend.restoreSession(cookies.token);
        const resJson = await response.json();
        if (resJson['valid']) {
          // OK
          dispatch({
              type: "LOGIN",
              payload: resJson
          })
        }
      }
    }

    restoreSession();
    return(
        <div className={classes.root}>
          <GameDrawer />
        </div>
    );
}
