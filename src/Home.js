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
      if (cookies.token && !state.user.token && !state.isLoading) {
        state.isLoading = true;
        console.log('Restoring session');
        const response = await fetch(Backend.AUTH_URL,  {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({
                a: "restore",
                token: cookies.token
            })
          })
        const resJson = await response.json();
        if (resJson && resJson.user && resJson.user.valid) {
          // OK
          dispatch({
              type: "LOAD",
              payload: resJson
          })
          let eventSource = new EventSource(Backend.MESSAGES_URL + '?user_id=' + state.user_id);
          eventSource.onmessage = e => {
            dispatch({
              type: 'MESSAGES',
              payload: JSON.parse(e.data),
            })
          }
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
