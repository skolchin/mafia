import React from 'react';
import Backend from './backend';

const updateGame = (state, game) => {
    return state.games.map(g => (game._id === g._id  ? game : g));
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return Backend.INITIAL_APP_STATE;
  
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
                lastMessage: 'New game created',
            };

        case 'GAME_UPDATE':
            return {
                ...state,
                games: updateGame(state, action.payload),
            }

        case 'MSG_UPDATE':
            return {
                ...state,
                games: updateGame(state, action.payload.game),
                lastMessage: action.payload.change.creator_id !== state.user.user_id 
                    ? 'Game "' + action.payload.game.name + '" has been updated' 
                    : null,
            }

        case 'MSG_STATUS_CHANGE':
            return {
                ...state,
                games: updateGame(state, action.payload.game),
                lastMessage: Backend.getGameStatusMessage(action.payload.game, action.payload.change),
            }

        case 'NEW_MEMBER':
            return {
                ...state,
                games: updateGame(state, action.payload.game),
                lastMessage: 'New member joined the game "' + action.payload.game.name + '"',
            }
            
        case 'HIDE_MESSAGE':
            return {
                ...state,
                lastMessage: null
            }

        default:
            return state;
    }
}

export const AppContext = React.createContext(Backend.INITIAL_APP_STATE);
export const AppReducer = () => React.useReducer(reducer, Backend.INITIAL_APP_STATE);

