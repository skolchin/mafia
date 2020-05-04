import React from 'react';
import Backend from './backend';
import gameReducer from './game_reducer';

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.game_id === action.payload.game_id ? gameReducer(g, action) : g));
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
            }
  
        case 'LOGOUT':
            return {
                ...state,
                user: Backend.emptyUser(),
            }
  
        case 'PROFILE':
            return {
                ...state,
                profileOpening: true,
            }
  
        case 'LOAD':
            return {
                ...state,
                user: action.payload.user,
                games:action.payload.games,
            }

        case 'NEW_GAME':
            return {
                ...state, 
                games: [
                    ...state.games, 
                    action.payload,
                ],
            };

        case 'CHANGE_NAME':
        case 'CHANGE_STATE':
        case 'STOP_GAME':
        case 'JOIN_GAME':
            return {
                ...state,
                games: callGameReducer(state, action),
            }

        default:
            return state;
    }
}

export const AppContext = React.createContext(Backend.initialState());
export const AppReducer = () => React.useReducer(reducer, Backend.initialState());

