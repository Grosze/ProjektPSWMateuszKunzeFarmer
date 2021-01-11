import { logIn } from '../store/actions/userActions.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';


function LoginScreen ({user, logIn}) {
    const mqtt = require('mqtt');

    const [input, setInput] = useState('');
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
                const login = JSON.parse(message);
                logIn(login);
                
            });

            return state;
        });
    
    }, []);

    const handleLogIn = () => {
        client.subscribe(input+'/LogIn')

        axios.post('/LogIn', 
            {
                login: input
            }

        ).then(() => {
            setInput(''); 

        });

    };

    return (
        <div>
            <input type='text' value={input} onChange={y => setInput(y.target.value)}/>
            <button onClick={() => handleLogIn()}>LOG IN</button>
        </div>
    );

};

const mapStateToProps  = (state) => (
    {
      user:state.user
    }
);
  
export default connect(mapStateToProps, {logIn})(LoginScreen);

