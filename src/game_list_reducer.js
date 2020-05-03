import React from 'react';
import Backend from './backend';
import gameReducer from './game_reducer';

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.game_id === action.payload.game_id ? gameReducer(g, action) : g));
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD':
            return {
                ...state,
                games: action.payload,
            };

        case "NEW_GAME":
            return {
                ...state, 
                games: [
                    ...state.games, 
                    action.payload,
                ],
                error: null,
            };

        case "CHANGE_NAME":
        case "CHANGE_STATE":
        case "STOP_GAME":
        case 'JOIN_GAME':
            return {
                ...state,
                games: callGameReducer(state, action),
                error: null,
            }
    
        default:
            return state;    
    }
}

export const GameListContext = React.createContext(Backend.emptyGameList());
export const GameListReducer = () => React.useReducer(reducer, Backend.emptyGameList());
