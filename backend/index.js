var mosca = require('mosca');
var settings = {port: 1883};
require('dotenv').config();

const broker = new mosca.Server(settings);

// Uruchamiam broker mqtt

broker.on('ready', () => {
    console.log('Broker jest gotowy do pracy!');
});

