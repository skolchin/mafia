import React from 'react';
import Backend from './backend';
import gameReducer from './game_reducer';

const callGameReducer = (state, action) => {
    return state.games.map(g => (g.game_id === action.payload.game_id ? gameReducer(g, action) : g));
}

const callGameReducerWithList = (state, type, games) => {
    return !games 
        ? state 
        : state.games.map(g => {
            for(let i = 0; i < games.length; i++) {
                if (games[i].game_id === g.game_id)
                    return gameReducer(g, { type: type, payload: games[i] })
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

        case 'GAME_UPDATE':
            return {
                ...state,
                games: callGameReducerWithList(state, action.type, action.payload.game),
                lastMessage: action.payload.change.creator_id !== state.user.user_id 
                    ? 'Game "' + action.payload.game.name + '" has been updated' 
                    : null,
            }

        case 'STATUS_CHANGE':
            return {
                ...state,
                games: callGameReducerWithList(state, action.type, action.payload.game),
                lastMessage: 'Game "' + action.payload.game.name + '" status has changed to ' + action.payload.change.status,
            }

        case 'NEW_MEMBER':
            return {
                ...state,
                games: callGameReducerWithList(state, action.type, action.payload.game),
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

