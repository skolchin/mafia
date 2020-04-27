import React from 'react';
import { backend } from './backend';
import gameReducer from './game_reducer';

const initialState = {
    games: [],
    error: null,
}

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.id === action.payload.id ? gameReducer(g, action) : g));
}

const reducer = (state, action) => {
    try {
        switch (action.type) {
            case "NEW_GAME":
                return {
                    ...state, 
                    games: [
                        ...state.games, 
                        backend.newGame(action.payload.user)
                    ],
                    error: null,
                };
    
            case "CHANGE_NAME":
            case "NEXT_STATE":
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
    } catch (e) {
        return {
            ...state,
            error: e.message,
        }
    }
}

export const GameListContext = React.createContext(initialState);
export const GameListReducer = () => React.useReducer(reducer, initialState);
