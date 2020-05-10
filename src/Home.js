import React, { useEffect } from 'react';
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
  
    useEffect(() => {
      if (cookies.token && !state.user.token) {
        console.log('Restoring session');
        fetch(Backend.AUTH_URL,  {
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
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then(resJson => {
          if (resJson && resJson.user && resJson.user.valid) {
            // OK
            dispatch({
              type: "LOAD",
              payload: resJson,
            })

            if (!Backend.eventSource) {
              console.log('New event stream');
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
              });
            }
          }
        })
      }
    }, [dispatch, cookies.token, state.user.token])

    return(
        <div className={classes.root}>
          <GameDrawer />
        </div>
    );
}
