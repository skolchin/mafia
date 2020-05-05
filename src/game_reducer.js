import React from 'react';
import Backend from './backend';

const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_NAME":
          return {
              ...state,
              name: action.payload.name,
          }

      case "CHANGE_STATE":
        return {
            ...state,
            status: action.payload.status,
            period: action.payload.period,
            round: action.payload.round,
        }

      case "STOP_GAME":
        return {
            ...state, 
            status: 'finish', 
        };

        case 'JOIN_GAME':
            return action.payload;
        
      default:
          return state;
  }
}

export default reducer;
