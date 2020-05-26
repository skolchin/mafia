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

        case 'MSG_GAME_UPDATE':
            switch(action.payload.change.type) {
                case 'name':
                    return {
                        ...state,
                        games: updateGame(state, action.payload.game),
                        lastMessage: action.payload.change.user_id !== state.user._id 
                            ? 'Game "' + action.payload.game.name + '" has been updated' 
                            : null,
                    }
    
                case 'status':
                case 'cancel':
                    return {
                        ...state,
                        games: updateGame(state, action.payload.game),
                        lastMessage: action.payload.change.user_id !== state.user._id 
                            ? Backend.getGameStatusMessage(action.payload.game, action.payload.change)
                            : null,
                    }

                case 'period':
                    return {
                        ...state,
                        games: updateGame(state, action.payload.game),
                        lastMessage: action.payload.change.user_id !== state.user._id 
                        ? 'Game period "' + action.payload.game.name + '" has changed to '+ action.payload.change.period
                        : null,
                    }

                case 'join':
                    return {
                        ...state,
                        games: updateGame(state, action.payload.game),
                        lastMessage: 'New member joined the game "' + action.payload.game.name + '"',
                    }
        
                default:
                    return state;
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

