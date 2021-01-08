import { logIn } from '../store/actions/userActions.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { useState } from 'react';


function LoginScreen ({user, logIn}) {
    const [input, setInput] = useState('');
    const [topicer, setTopicer] = useState('');
    const mqtt = require('mqtt');
    const client = mqtt.connect('mqtt:localhost:9001');

    client.on('message', (topic, message) => {
        const login = JSON.parse(message)["login"];
        logIn(login);

        client.unsubscribe(topicer);
        
    });

    const handleLogIn = () => {
        client.subscribe(input+'/LogIn')

        axios.post('/LogIn', 
            {
                login: input
            }
        ).then((result) => {
            setTopicer(input+'/LogIn');
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

