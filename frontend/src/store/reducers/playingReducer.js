import { JOIN_GAME, SPECTATE_GAME, EXIT_GAME, NEW_MESSAGE_IN_GAME_CHAT, NEW_GAME_STATE, GAME_WON_BY } from '../types.js';

const initialState = {
    isPlaying: false,
    isSpectating: false,
    roomId: '',
    players: [],
    playersStats: {},
    turn: '',
    redDice: '',
    greenDice: '',
    isGameEnded: false,
    isGameStarted: false,
    whoWon:'',
    chat:[]
};

const playingReducer = (state= initialState, action) => {
    switch (action.type) {
        case JOIN_GAME:
            return {
                ...state,
                isPlaying: true,
                roomId: action.roomId, 
            };

        case SPECTATE_GAME:
            return {
                ...state,
                isSpectating: true,
                roomId: action.roomId, 
            };
        
        case EXIT_GAME:
            return initialState;
        
        case NEW_MESSAGE_IN_GAME_CHAT:
            return {
                ...state,
                chat: action.chat
            }

        case NEW_GAME_STATE:
            return {
                ...state,
                players: action.players,
                playersStats: action.playersStats,
                turn: action.turn,
                redDice: action.redDice,
                greenDice: action.greenDice,
                isGameStarted:true
            };
        
        case GAME_WON_BY:
            return {
                ...state,
                whoWon: action.whoWon,
                isGameEnded: true
            };
        
        default:
            return state;
        
    };

};

export default playingReducer;