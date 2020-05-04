import React from 'react';

import './App.css';
import Home from './Home';
import Profile from './Profile';

import { AppContext, AppReducer } from './app_context';

function App() {
  const [state, dispatch] = AppReducer();

  return (
      <div className="App">
        <AppContext.Provider value={[state, dispatch]}>
            {state.profileOpening ? <Profile />  : <Home />}
        </AppContext.Provider>
      </div>
    );
}

export default App;
