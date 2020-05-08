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

const saveMessages = (msg_type, msg_data, last_only=false) => {
    const msgToString = (msg_type, m) => {
        return msg_type === 'GAME_UPDATE' 
            ? 'Game "' + m.name + '" has been updated'
            : 'New message of type ' + msg_type.toLowerCase() + ' received'
    }
    let msg_list = 
        !msg_data 
            ? [] 
            : msg_data.map(m => msgToString(msg_type, m))
    return last_only ? msg_list[msg_list.length-1] : msg_list
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
                games: callGameReducerWithList(state, action.type, action.payload),
                messages: 
                    [
                        ...state.messages, 
                        saveMessages(action.type, action.payload),
                    ],
                lastMessage: saveMessages(action.type, action.payload, true),
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

