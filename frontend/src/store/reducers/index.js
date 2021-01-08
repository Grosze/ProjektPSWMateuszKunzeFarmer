import { combineReducers } from 'redux';
import userReducer from './userReducer.js';
import gamesReducer from './gamesReducer.js';
import playingReducer from './playingReducer.js';

const root = combineReducers({
    user: userReducer,
    games: gamesReducer,
    playing: playingReducer
});

export default root;
