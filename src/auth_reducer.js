import React from 'react';
import Backend from './backend';

const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
          return action.payload;

      case "LOGOUT":
          return Backend.emptyUser();

      case "PROFILE":
        return {
          ...state,
          profileOpening: true,
        }
        
      default:
          return state;
  }
}

export const AuthContext = React.createContext(Backend.emptyUser());
export const AuthReducer = () => React.useReducer(reducer, Backend.emptyUser());


