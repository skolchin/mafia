import React from 'react';
import { initialAuthState } from './backend';

const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
          return action.payload;

      case "LOGOUT":
          return initialAuthState;

      case "PROFILE":
        return {
          ...state,
          profileOpening: true,
        }
        
      default:
          return state;
  }
}

export const AuthContext = React.createContext(initialAuthState);
export const AuthReducer = () => React.useReducer(reducer, initialAuthState);


