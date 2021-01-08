import {JOIN_GAME, SPECTATE_GAME, EXIT_GAME} from '../types.js';

export const joinGame = (roomId) => async dispatch => {
    try {
        dispatch ({
            type: JOIN_GAME,
            roomId: roomId,
        });

    } catch (err) {
        console.log(err);

    };

};