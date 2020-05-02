import React from 'react';

import './App.css';
import Home from './Home';
import Profile from './Profile';

import { AuthContext, AuthReducer } from './auth_reducer';
import { GameListContext, GameListReducer } from './game_list_reducer';

function App() {
  const [authState, authDispatch] = AuthReducer();
  const [gameListState, gameListDispatch] = GameListReducer();

  return (
      <div className="App">
        <AuthContext.Provider value={[authState, authDispatch]}>
          <GameListContext.Provider value={[gameListState, gameListDispatch]}>
              {authState.profileOpening ? <Profile />  : <Home />}
          </GameListContext.Provider>
        </AuthContext.Provider>
      </div>
    );
}

export default App;
