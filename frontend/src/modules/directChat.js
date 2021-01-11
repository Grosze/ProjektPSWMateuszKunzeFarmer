import { newChatState, newPlayersList, newInput } from '../store/actions/directChatActions.js';
import Select from 'react-select';
import axios from 'axios';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';


function DirectChat ({user, directChat, newChatState, newPlayersList, newInput}) {
    const mqtt = require('mqtt');

    const options = directChat.allUsers.map(x => {
        return {
            value: x,
            label: x
        };

    });

    const [client, setClient] = useState(mqtt.connect('mqtt:localhost:9001'));
    const [select, setSelect] = useState('')

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
                const topicSplitted = topic.split('/');
                if (topicSplitted[topicSplitted.length - 1] === 'NewPlayersList') {
                    newPlayersList(JSON.parse(message));

                } else if (topicSplitted[topicSplitted.length - 1] === 'NewChatState') {
                    newChatState(JSON.parse(message));

                };
                
            });

            state.subscribe('/' + user.login + '/NewPlayersList');
            state.subscribe('/' + user.login + '/NewChatState');

            return state;
        });
    
    }, []);

    const handleRefreshPlayersList = () => {
        axios.get('/' + user.login + '/getAllUsers');

    };

    const handleCreatingChatRoom = () => {
        axios.post('/' + user.login + '/CreateChatRoom/' + select);

    };

    const handlePostMessage = (to, message) => {
        axios.post('/' + user.login + '/PostAMessageTo/' + to,{
            message
        });

    };

    return (
        <div>
            <div className='StatsDisplay'>
                Begin Chat with: 
                <Select options={options} onChange={y => setSelect(y.value)}/>
                <button onClick={() => handleCreatingChatRoom()}>START</button>
                <button onClick={() => handleRefreshPlayersList()}>REFRESH PLAYERS LIST</button>
            </div>
            <div>
                {directChat.users.map(x => {
                    return (
                        <div className='StatsDisplay'>
                            {directChat.chats[x].map(y => {
                                return (
                                    <div className='Mapper'>
                                        {y}
                                    </div>
                                );
                            })}
                            <div className='Mapper'>
                                <input value={directChat.inputs[x]} onChange={y => newInput(x, y.target.value)}/>
                                <button onClick={() => handlePostMessage(x, directChat.inputs[x])}>SEND</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );

};

const mapStateToProps  = (state) => (
    {
      user: state.user,
      directChat: state.directChat
    }
);
  
export default connect(mapStateToProps, {newChatState, newPlayersList, newInput})(DirectChat);

