import { addGame, clearGamesList } from '../store/actions/gamesActions.js';
import { joinGame, spectateGame } from '../store/actions/playingActions.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

function GamesList ({games, user, addGame, clearGamesList, joinGame, spectateGame}) {
    const mqtt = require('mqtt');
    const [client, setClient] = useState(mqtt.connect('mqtt:localhost:9001'));

    useEffect(() => {
        setClient(state => {
            state.on('connect', () => {
                console.log('connected!');
    
            });
    
            state.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
    
            });
    
            state.on('message', (topic, message) => {
                switch (topic) {
                    case '/' + user.login + '/GamesList':
                        clearGamesList()

                        const data = JSON.parse(message);
                        
                        data.forEach(game => {
                        addGame(game);

                        });

                        break;
                    
                    default:
                        const wantToJoinOrSpectate = topic.split('/')[topic.split('/').length - 1];

                        if (wantToJoinOrSpectate === 'JoinInfo') {
                            joinGame(JSON.parse(message));

                        } else {
                            spectateGame(JSON.parse(message));

                        };

                };
                
            });

            state.subscribe('/' + user.login + '/GamesList');

            return state;
        });

        axios.get('/' + user.login + '/getGamesList');
    
    }, []);

    const handleRefresh = () => {
        axios.get('/' + user.login + '/getGamesList');

    };

    const handleCreateGame = () => {
        axios.post('/CreateGame');

    };

    const handleJoinGame = (id) => {
        client.subscribe('/' + user.login + '/Game/' + id + '/JoinInfo');
        axios.post('/' + user.login + '/JoinGame/' + id);

    };

    const handleSpectateGame = (id) => {
        client.subscribe('/' + user.login + '/Game/' + id + '/SpectateInfo');
        axios.post('/' + user.login + '/SpectateGame/' + id);

    };

    return (
        <div className='Games-div'>
            <button onClick={() => handleRefresh()}>REFRESH</button>
            <button onClick={() => handleCreateGame()}>CREATE GAME</button>
            <table className='Games-List'>
                <thead>
                    <tr>
                        <th>Game id</th>
                        <th>PlayersNumber</th>
                        <th>hasStarted</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {games.map(x => {
                        return (
                            <tr key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.playersNumber}/4</td>
                                <td>{x.hasStarted}</td>
                                <td><button onClick={() => {handleJoinGame(x.id)}}>JOIN</button></td>
                                <td><button onClick={() => {handleSpectateGame(x.id)}}>SPECTATE</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

};

const mapStateToProps  = (state) => (
    {
      user: state.user,
      games: state.games
    }
);
  
export default connect(mapStateToProps, {addGame, clearGamesList, joinGame, spectateGame})(GamesList);

