import { addGame, clearGamesList } from '../store/actions/gamesActions.js';
import { joinGame } from '../store/actions/playingActions.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

function GamesList ({games, user, addGame, clearGamesList, joinGame}) {
    const mqtt = require('mqtt');
    const client = mqtt.connect('mqtt:localhost:9001');
    const [gameId, setGameId] = useState('');

    useEffect(() => {
            const mqtt = require('mqtt');
            const client = mqtt.connect('mqtt:localhost:9001');

            client.on('connect', () => {
                client.subscribe('/' + user.login + '/GamesList');
        
            });
            
            client.on('message', async (topic, message) => {
                console.log('hi');
                switch (topic) {
                    case '/' + user.login + '/GamesList':
                        const gamesList = JSON.parse(message);
                        
                        clearGamesList();

                        gamesList.forEach(x => {
                            addGame(x);

                        }); 

                        break;
                    
                    case '/Game/' + gameId + '/JoinInfo':
                        const id = JSON.parse(message);
                        console.log('hello');

                        joinGame(id);

                        break;

                    default:
                        console.log('error');
                };  
        
            });

    }, []);

    const handleRefresh = () => {
        axios.get('/' + user.login + '/getGamesList');

    };

    const handleCreateGame = () => {
        axios.post('/CreateGame');
        handleRefresh();

    };

    const handleJoin = (id) => {
        console.log(id);
        setGameId(id);
        client.subscribe('/Game/' + id + '/JoinInfo');
        axios.post('/' + user.login + '/JoinGame/' + id);

    };

    const handleSpectate = () => {

    };

    return (
        <div>
            <button onClick={() => handleRefresh()}>REFRESH</button>
            <button onClick={() => handleCreateGame()}>CREATE GAME</button>
            <table>
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
                            <tr id={x.id}>
                                <td>{x.id}</td>
                                <td>{x.playersNumber}/4</td>
                                <td>{x.hasStarted}</td>
                                <td><button onClick={() => {handleJoin(x.id)}}>JOIN</button></td>
                                <td><button>SPECTATE</button></td>
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
  
export default connect(mapStateToProps, {addGame, clearGamesList, joinGame})(GamesList);

