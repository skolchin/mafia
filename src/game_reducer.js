import React from 'react';
import Backend from './backend';

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
                    period: state.period === 'day' ? 'night' : 'day',
                    round: state.period === 'night' ? state.round + 1 : state.round,
                };

            default:
                return state;
          }

      case "STOP_GAME":
        return {
            ...state, 
            status: 'finish', 
        };

        case 'JOIN_GAME':
            return Backend.joinGame(state, action.payload.user, action.payload.role);
    
        case 'ASSIGN_ROLES':
            return Backend.assignRoles(state);
    
      default:
          return state;
  }
}

export const GameContext = React.createContext(Backend.emptyGame());
export const GameReducer = () => React.useReducer(reducer, Backend.emptyGame());
export default reducer;
