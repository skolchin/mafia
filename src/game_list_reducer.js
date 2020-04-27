import React from 'react';
import { backend } from './backend';
import gameReducer from './game_reducer';

const initialState = {
    games: [],
}

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.id === action.payload.id ? gameReducer(g, action) : g ));
}

const reducer = (state, action) => {
    switch (action.type) {
        case "NEW_GAME":
            return {
                ...state, 
                games: [
                    ...state.games, 
                    backend.newGame(action.payload.user)
                ],
            };
  
        case "CHANGE_NAME":
        case "NEXT_STATE":
        case "STOP_GAME":
            return {
                ...state,
                games: callGameReducer(state, action),
            }
      
        default:
            return state;
  }
}

export const GameListContext = React.createContext(initialState);
export const GameListReducer = () => React.useReducer(reducer, initialState);
