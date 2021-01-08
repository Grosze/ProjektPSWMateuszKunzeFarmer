import { ADD_GAME, CLEAR_GAMES_LIST } from '../types.js';

export const addGame = (gameData) => async dispatch => {
    try {
        dispatch ({
            type: ADD_GAME,
            id: gameData.id,
            playersNumber: gameData.playersNumber,
            hasStarted: gameData.hasStarted
        });

    } catch (err) {
        console.log(err);

    };

};

export const clearGamesList = () => async dispatch => {
    try {
        dispatch ({
            type: CLEAR_GAMES_LIST,
        });

    } catch (err) {
        console.log(err);

    };

};