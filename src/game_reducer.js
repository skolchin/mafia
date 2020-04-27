import React from 'react';
import { initialGameState } from './backend';

const reducer = (state, action) => {
    switch (action.type) {
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

      case "STOP_GAME":
        return {
            ...state, 
            status: 'finish', 
        };

      default:
          return state;
  }
}

export const GameContext = React.createContext(initialGameState);
export const GameReducer = () => React.useReducer(reducer, initialGameState);
export default reducer;
