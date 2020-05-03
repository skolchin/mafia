import React from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from './auth_reducer';
import { GameListContext } from './game_list_reducer';
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
    const [authState, authDispatch] = React.useContext(AuthContext);
    const [, gameListDispatch] = React.useContext(GameListContext);
    const [cookies] = useCookies(['token']);
  
    const restoreSession = async () => {
      if (cookies.token && !authState.login && !authState.token) {
        const response = await Backend.restoreSession(cookies.token);
        const resJson = await response.json();
        if (resJson && resJson.user && resJson.user.valid) {
          // OK
          authDispatch({
              type: "LOGIN",
              payload: resJson.user
          })
          gameListDispatch({
            type: "LOAD",
            payload: resJson.games,
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
