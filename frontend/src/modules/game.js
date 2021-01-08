import axios from 'axios';
import { connect } from 'react-redux';
import { useState } from 'react';


function Game ({playing}) {
    if (playing.isPlaying === true) {
        return (
            <div>
                {playing.roomId}
            </div>
        );

    } else {
        return (
            <div>
                not playing
            </div>
        );

    };
};

const mapStateToProps  = (state) => (
    {
      user:state.user,
      playing:state.playing
    }
);
  
export default connect(mapStateToProps, {})(Game);

