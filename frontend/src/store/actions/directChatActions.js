import { NEW_CHAT_STATE, NEW_PLAYERS_LIST, NEW_INPUT } from '../types.js';

export const newChatState =  (state) => async dispatch => {
    try {
        dispatch ({
            type: NEW_CHAT_STATE,
            users: state.users,
            chats: state.chats,
            inputs: state.inputs
        });

    } catch (err) {
        console.log(err);
        
    };

};

export const newPlayersList = (list) => async dispatch => {
    try {
        dispatch ({
            type: NEW_PLAYERS_LIST,
            allUsers: list,
        });

    } catch (err) {
        console.log(err);
        
    };

};

export const newInput = (login, input) => async dispatch =>{
    try {
        dispatch ({
            type: NEW_INPUT,
            login,
            input
        });

    } catch (err) {
        console.log(err);
        
    };

};