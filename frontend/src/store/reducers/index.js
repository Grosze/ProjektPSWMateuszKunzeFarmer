import { combineReducers } from 'redux';
import userReducer from './userReducer.js';
import gamesReducer from './gamesReducer.js';
import playingReducer from './playingReducer.js';
import directChatReducer from './directChatReducer.js';

const root = combineReducers({
    user: userReducer,
    games: gamesReducer,
    playing: playingReducer,
    directChat: directChatReducer
});

export default root;
