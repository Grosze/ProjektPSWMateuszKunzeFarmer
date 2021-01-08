import { bindActionCreators } from 'redux';
import { ADD_GAME } from '../types.js'

const gameReducer = (state, action) => {
    switch (action.type) {
        case ADD_GAME:
            return {
                id: action.id,
                playersNumber: action.playersNumber,
                hasStarted: action.hasStarted
            };
        
        default:
            return state;
        
    };

};

export default gameReducer;