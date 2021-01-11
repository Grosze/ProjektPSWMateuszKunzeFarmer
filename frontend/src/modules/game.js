import axios from 'axios';
import { newMessageInChat, newGameState, gameWonBy, exitGame } from '../store/actions/playingActions.js';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';


function Game ({playing, user, newMessageInChat, newGameState, gameWonBy, exitGame}) {
    const [input, setInput] = useState('');

    const mqtt = require('mqtt');
    const [client, setClient] = useState(mqtt.connect('mqtt:localhost:9001'));

    useEffect(() => {
        if (playing.roomId !== '') {
            setClient(state => {
                state.on('connect', () => {
                    console.log('connected!');
        
                });
        
                state.on('error', (err) => {
                    console.error('Connection error: ', err);
                    client.end();
        
                });
        
                state.on('message', (topic, message) => {
                    const topicSplitted = topic.split('/');

                    if (topicSplitted[topicSplitted.length-1] === 'NewMessageInChat') {
                        const chat = JSON.parse(message);
                        newMessageInChat(chat);

                    } else if (topicSplitted[topicSplitted.length-1] === 'NewGameState') {
                        const state = JSON.parse(message);
                        newGameState(state);

                    } else if (topicSplitted[topicSplitted.length-1] = 'WonBy') {
                        const whoWon = JSON.parse(message);
                        gameWonBy(whoWon);

                    };
                    
                });

                state.subscribe('/Game/' + playing.roomId + '/NewMessageInChat');
                state.subscribe('/Game/' + playing.roomId + '/NewGameState');
                state.subscribe('/Game/' + playing.roomId + '/WonBy');
    
                return state;
            });
        };
    
    }, [playing.roomId]);

    const handleMessagePosting = () => {
        axios.post('/' + user.login + '/PostMessage/' + playing.roomId,
            {
                message: input
            }

        ).then(() => {
            setInput('');

        });

    };

    const handleStartGame = () => {
        axios.post('/StartGame/' + playing.roomId);

    };

    const handleExchange = (from, to) => {
        axios.post('/' + user.login + '/Exchange/' + playing.roomId,
            {
                from,
                to
            }
        );

    };

    const handleEndTurn = () => {
        axios.post('/' + user.login + '/EndTurn/' + playing.roomId);

    };

    if (playing.isPlaying === true) {

        if (playing.isGameStarted === false) {
            return (
                <div>
                    <div>
                        <button onClick={() => handleStartGame()}>START GAME</button>
                        <input value={input} onChange={y => setInput(y.target.value)} />
                        <button onClick={() => handleMessagePosting()}>POST A MESSAGE</button>
                    </div>
                    <div>
                        {playing.chat.map((x, index) => {
                            return (
                                <div key={index}>
                                    {x}
                                </div>
                            )
                        })}
                    </div>
                </div>
            );

        } else {
            if (playing.isGameEnded === false) {
                return (
                    <div>
                        <div className="PlayingDisplay">
                            <div className='Mapper'>redDice: {playing.redDice}</div>
                            <div className='Mapper'>greenDice: {playing.greenDice}</div>
                            <div className='Mapper'>turn: {playing.turn}</div>
                        </div>
                        <div className="PlayingDisplay">
                            {playing.players.filter(x => x !== user.login).map(x => {
                                return (
                                    <div className='StatsDisplay'> 
                                        <div className='Mapper'>{x}</div>
                                        <div className='Mapper'>rabbit: {playing.playersStats[x].rabbit}</div>
                                        <div className='Mapper'>sheep: {playing.playersStats[x].sheep}</div>
                                        <div className='Mapper'>pig: {playing.playersStats[x].pig}</div>
                                        <div className='Mapper'>cow: {playing.playersStats[x].cow}</div>
                                        <div className='Mapper'>horse: {playing.playersStats[x].horse}</div>
                                        <div className='Mapper'>smallDog: {playing.playersStats[x].smallDog}</div>
                                        <div className='Mapper'>bigDog: {playing.playersStats[x].bigDog}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="StatsDisplay">
                            <div className='Mapper'>
                                rabbit:{playing.playersStats[user.login].rabbit}
                                <button onClick={() => handleExchange('rabbit', 'sheep')}>TRADE FOR SHEEP</button>
                            </div>
                            <div className='Mapper'>
                                sheep:{playing.playersStats[user.login].sheep}
                                <button onClick={() => handleExchange('sheep', 'rabbit')}>TRADE FOR RABBIT</button>
                                <button onClick={() => handleExchange('sheep', 'pig')}>TRADE FOR PIG</button>
                            </div>
                            <div className='Mapper'>
                                pig:{playing.playersStats[user.login].pig}
                                <button onClick={() => handleExchange('pig', 'sheep')}>TRADE FOR SHEEP</button>
                                <button onClick={() => handleExchange('pig', 'cow')}>TRADE FOR COW</button>
                            </div>
                            <div className='Mapper'>
                                cow:{playing.playersStats[user.login].cow}
                                <button onClick={() => handleExchange('cow', 'pig')}>TRADE FOR PIG</button>
                                <button onClick={() => handleExchange('cow', 'horse')}>TRADE FOR HORSE</button>
                            </div>
                            <div className='Mapper'>
                                horse:{playing.playersStats[user.login].horse}
                                <button onClick={() => handleExchange('horse', 'cow')}>TRADE FOR COW</button>
                            </div>
                            <div className='Mapper'>
                                smallDog:{playing.playersStats[user.login].smallDog}
                                <button onClick={() => handleExchange('sheep', 'smallDog')}>BUY FOR 1 SHEEP</button>
                            </div>
                            <div className='Mapper'>
                                bigDog:{playing.playersStats[user.login].bigDog}
                                <button onClick={() => handleExchange('cow', 'bigDog')}>BUY FOR 1 COW</button>
                            </div>
                            <button onClick={() => handleEndTurn()}>End Turn</button>
                        </div>
                        <div className="StatsDisplay">
                            <div className='Mapper'>6 rabbits = 1 sheep</div>
                            <div className='Mapper'>2 sheeps = 1 pig</div>
                            <div className='Mapper'>3 pigs = 1 cow</div>
                            <div className='Mapper'>2 cows = 1 horse</div>
                        </div>
                        <div className="StatsDisplay">
                            <input value={input} onChange={y => setInput(y.target.value)} />
                            <button onClick={() => handleMessagePosting()}>POST A MESSAGE</button>
                        </div>
                        <div  className="StatsDisplay">
                            {playing.chat.map((x, index) => {
                                return (
                                    <div className='Mapper' key={index}>
                                        {x}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className='StatsDisplay'>
                        <div  className='Mapper'>GAME WON BY: {playing.whoWon}</div>
                        <div  className='Mapper'><button onClick={() => exitGame()}>EXIT GAME</button></div>
                    </div>
                );
            };
        };

    } else if (playing.isSpectating === true){
        if (playing.isGameStarted === false) {
            return (
                <div>
                    <div>
                        <input value={input} onChange={y => setInput(y.target.value)} />
                        <button onClick={() => handleMessagePosting()}>POST A MESSAGE</button>
                    </div>
                    <div>
                        {playing.chat.map((x, index) => {
                            return (
                                <div key={index}>
                                    {x}
                                </div>
                            )
                        })}
                    </div>
                </div>
            );

        } else {
            if (playing.isGameEnded === false) {
                return (
                    <div>
                        <div className='PlayingDisplay'>
                            <div className='Mapper'>redDice: {playing.redDice}</div>
                            <div className='Mapper'>greenDice: {playing.greenDice}</div>
                            <div className='Mapper'>turn: {playing.turn}</div>
                        </div>
                        <div className="PlayingDisplay">
                            {playing.players.map(x => {
                                return (
                                    <div className='StatsDisplay'> 
                                        <div className='Mapper'>{x}</div>
                                        <div className='Mapper'>rabbit: {playing.playersStats[x].rabbit}</div>
                                        <div className='Mapper'>sheep: {playing.playersStats[x].sheep}</div>
                                        <div className='Mapper'>pig: {playing.playersStats[x].pig}</div>
                                        <div className='Mapper'>cow: {playing.playersStats[x].cow}</div>
                                        <div className='Mapper'>horse: {playing.playersStats[x].horse}</div>
                                        <div className='Mapper'>smallDog: {playing.playersStats[x].smallDog}</div>
                                        <div className='Mapper'>bigDog: {playing.playersStats[x].bigDog}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            
            } else {
                return (
                    <div className='StatsDisplay'>
                        <div  className='Mapper'>GAME WON BY: {playing.whoWon}</div>
                        <div  className='Mapper'><button onClick={() => exitGame()}>EXIT GAME</button></div>
                    </div>
                );
            };
        };

    } else {
        return (
            <div>
                Youre not in any Game!
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
  
export default connect(mapStateToProps, {newMessageInChat, newGameState, gameWonBy, exitGame})(Game);

