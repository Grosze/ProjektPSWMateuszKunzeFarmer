import { JOIN_GAME, SPECTATE_GAME, EXIT_GAME } from '../types.js';

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
    isGameStarted: false
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
        
        default:
            return state;
        
    };

};

export default playingReducer;