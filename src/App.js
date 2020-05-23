import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useCookies } from 'react-cookie';

import './App.css';
import Backend from './backend';
import GameDrawer from './Drawer';
import Profile from './Profile';
import GameProfile from './GameProfile';

import { AppContext, AppReducer } from './app_context';

function App() {
  const [state, dispatch] = AppReducer();
  const [cookies] = useCookies(['token']);
  
/*   useEffect(() => {
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
 */

  return (
    <div className="App">
      <AppContext.Provider value={[state, dispatch]}>
        <Router>
          <Route exact path='/' component={GameDrawer} />
          <Route exact path='/profile/' component={Profile} />
          <Route
            path='/profile/:user_id'
            render={(props) => <Profile args={props} />}
          />
          <Route
            path='/game/:game_id'
            render={(props) => <GameProfile args={props} />}
          />
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
