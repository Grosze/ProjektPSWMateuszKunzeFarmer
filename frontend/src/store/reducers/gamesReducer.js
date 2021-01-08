import { ADD_GAME, CLEAR_GAMES_LIST } from '../types.js'
import gameReducer from './gameReducer.js';

const gamesReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_GAME:
            return [...state, gameReducer(undefined, action)];

        case CLEAR_GAMES_LIST:
            return [];
        
        default:
            return state
    };

};

export default gamesReducer;