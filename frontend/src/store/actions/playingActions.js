import {JOIN_GAME, SPECTATE_GAME, EXIT_GAME, NEW_MESSAGE_IN_GAME_CHAT, NEW_GAME_STATE, GAME_WON_BY} from '../types.js';

export const joinGame = (roomId) => async dispatch => {
    try {
        dispatch ({
            type: JOIN_GAME,
            roomId
        });

    } catch (err) {
        console.log(err);

    };

};

export const exitGame = () => async dispatch => {
    try {
        dispatch ({
            type: EXIT_GAME,
        });

    } catch (err) {
        console.log(err);

    };
};

export const spectateGame = (roomId) => async dispatch => {
    try {
        dispatch ({
            type: SPECTATE_GAME,
            roomId
        });

    } catch (err) {
        console.log(err);

    };

};

export const newMessageInChat = (chat) => async dispatch => {
    try {
        dispatch({
            type: NEW_MESSAGE_IN_GAME_CHAT,
            chat
        });

    } catch (err) {
        console.log(err);

    };

};

export const newGameState = (state) => async dispatch => {
    try {
        dispatch({
            type: NEW_GAME_STATE,
            ...state
        });
        
    } catch (err) {
        console.log(err);

    };

};

export const gameWonBy = (whoWon) => async dispatch => {
    try {
        dispatch({
            type: GAME_WON_BY,
            ...whoWon

        });

    } catch (err) {
        console.log(err);

    };

};