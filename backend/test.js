var mqtt =require('mqtt');
var client = mqtt.connect('mqtt://localhost:1883');
var topic = 'tomek/LogIn';


client.on('connect', () => {
    console.log('connected');
    client.subscribe(topic);
});

client.on('message', (topic, message) => {
    console.log('IT WORKS!!!');
    
});