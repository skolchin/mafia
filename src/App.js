import React from 'react';
import './App.css';
import Home from './Home';
import Profile from './Profile';

const initialState = {
    login: null,
    token: null,
    name: null,
    avatar: null,
    profileOpening: false,
}

const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
          return action.payload;

      case "LOGOUT":
          return {
              ...state,
              login: null,
              token: null,
          }

      case "PROFILE":
        return {
          ...state,
          profileOpening: true,
        }
        
      default:
          return state;
  }
}

export const AuthContext = React.createContext(initialState);

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
      <div className="App">
        <AuthContext.Provider value={[state, dispatch]}>
          {state.profileOpening ? <Profile />  : <Home />}
        </AuthContext.Provider>
      </div>
    );
}

export default App;
