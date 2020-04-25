import React from 'react';
import './App.css';
import Home from './Home';
import Profile from './Profile';

import { AuthContext, AuthReducer } from './auth';
import { GameContext, GameReducer } from './game';

function App() {
  const [authState, authDispatch] = AuthReducer();
  const [gameState, gameDispatch] = GameReducer();

  return (
      <div className="App">
        <AuthContext.Provider value={[authState, authDispatch]}>
          <GameContext.Provider value={[gameState, gameDispatch]}>
            {authState.profileOpening ? <Profile />  : <Home />}
          </GameContext.Provider>
        </AuthContext.Provider>
      </div>
    );
}

export default App;
