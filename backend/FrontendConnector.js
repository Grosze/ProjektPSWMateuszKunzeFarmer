const express = require('express');
const resmetryLib = require('resmetry');
const host = 'mqtt://localhost:1883';
const app = express();
const settings={
    protocolId: 'MQIsdp',
    protocolVersion: 3
};
const resmetry = new resmetryLib(host, settings, true); 

//Stawianie serwera API oraz łączenie się klienta mqtt z brokerem

app.listen(2137, () => {
    console.log('Server running on port 2137');

});

resmetry.on('connect', message => {
    console.log(message+' to MQTT');
    
});

//Enpointy

app.use(express.json());

app.post('/CreateNewGame', async (req, res) => {
    resmetry.request('CreateNewGameRequest','hello', {qos:2},'CreateNewGameResponse', (err, res) => {
        console.log(res);

    });
});
