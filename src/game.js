import React from 'react';
import { initialGameState, backend } from './backend';

const reducer = (state, action) => {
    switch (action.type) {
      case "NEW_GAME":
          return {
              ...initialGameState,
              id: backend.newGameId(),
              status: "new",
              started: new Date(),
              leader: action.payload.user,
              total: 1,
              members: [action.payload.user]
          }

      case "CHANGE_NAME":
          return {
              ...state,
              name: action.payload.name,
          }

      case "NEXT_STATE":
          switch(state.status) {
            case 'new':
                return {
                    ...state, 
                    status: 'start' 
                };

            case 'start':
                return {
                    ...state, 
                    status: 'active', 
                    period: 'day', 
                    round: 1 
                };

            case 'active':
                return {
                    ...state, 
                    period: state.period == 'day' ? 'night' : 'day',
                    round: state.period == 'night' ? state.round + 1 : state.round,
                };

            default:
                return state;
          }

      case "STOP":
          return initialGameState;
        
      default:
          return state;
  }
}

export const GameContext = React.createContext(initialGameState);
export const GameReducer = () => React.useReducer(reducer, initialGameState);


