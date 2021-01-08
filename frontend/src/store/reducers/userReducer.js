import { LOG_IN } from '../types.js';

const initialState = {
    login:'',
    isLogged: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                login: action.login,
                isLogged: true
            };

        default:
            return state;

    };

};

export default userReducer;