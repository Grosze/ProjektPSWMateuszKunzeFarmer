import { NEW_CHAT_STATE, NEW_PLAYERS_LIST, NEW_INPUT } from '../types.js';

const initialState = {
    allUsers:[],
    users:[],
    chats:{},
    inputs:{}
};

const directChatReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEW_CHAT_STATE:
            return {
                ...state,
                users: action.users,
                chats: action.chats,
                inputs: action.inputs
            };
        
        case NEW_PLAYERS_LIST:
            return {
                ...state,
                allUsers: action.allUsers
            };
        case NEW_INPUT:
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.login]: action.input
                }
            };
        
        default:
            return state;
        
    };

};

export default directChatReducer;