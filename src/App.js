import React from 'react';
import { BrowserRouter as Router, Route, } from "react-router-dom";

import './App.css';
import Home from './Home';
import Profile from './Profile';
import GameProfile from './GameProfile';

import { AppContext, AppReducer } from './app_context';

function App() {
  const [state, dispatch] = AppReducer();

  return (
    <div className="App">
      <AppContext.Provider value={[state, dispatch]}>
        <Router>
          <Route exact path='/' component={Home} />
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
