import React from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';

import { AppContext } from './app_context';
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
    const [state, dispatch] = React.useContext(AppContext);
    const [cookies] = useCookies(['token']);
  
    const restoreSession = async () => {
      if (cookies.token && !state.login && !state.user.token) {
        const response = await Backend.restoreSession(cookies.token);
        const resJson = await response.json();
        if (resJson && resJson.user && resJson.user.valid) {
          // OK
          dispatch({
              type: "LOAD",
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
