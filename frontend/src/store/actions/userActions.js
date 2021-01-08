import { LOG_IN } from '../types.js';

export const logIn = (login) => async dispatch => {
    try {
        dispatch ({
            type: LOG_IN,
            login: login,
            isLogged: true
        });

    } catch (err) {
        console.log(err);

    };

};