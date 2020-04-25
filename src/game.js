import React from 'react';
import { initialGameState } from './backend';

const reducer = (state, action) => {
    switch (action.type) {
      case "NEW_GAME":
          return {
              ...initialGameState,
              started: new Date(),
              leaderId: action.payload.user.id,
              leaderName: action.payload.user.name,
              total: 1,
              members: [action.payload.user]
          }

      case "CHANGE_NAME":
          return {
              ...state,
              name: action.payload.name,
          }

        
      default:
          return state;
  }
}

export const GameContext = React.createContext(initialGameState);
export const GameReducer = () => React.useReducer(reducer, initialGameState);


