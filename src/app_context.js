import React from 'react';
import Backend from './backend';
import gameReducer from './game_reducer';

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.game_id === action.payload.game_id ? gameReducer(g, action) : g));
}

const parseGameMessages = (state, messages) => {
    return state.games.map(g => {
        for(let i = 0; i < messages.length; i++) {
            if (messages[i].type === 'game_update' && messages[i].game_id === g.game_id)
                return messages.data
        }
        return g
    })
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
                user: Backend.INITIAL_USER_STATE,
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

        case 'MESSAGES':
            return {
                ...state,
                games: parseGameMessages(state, action.payload),
            }

        default:
            return state;
    }
}

export const AppContext = React.createContext(Backend.INITIAL_APP_STATE);
export const AppReducer = () => React.useReducer(reducer, Backend.INITIAL_APP_STATE);

