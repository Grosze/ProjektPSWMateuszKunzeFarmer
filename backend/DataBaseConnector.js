const driver = require('./Neo4jDriver/driver.js');
const resmetryLib = require('resmetry');
const host = 'mqtt://localhost:1883';
const settings={
  protocolId: 'MQIsdp',
  protocolVersion: 3
};

const session = driver.session();

const resmetry = new resmetryLib(host, settings, true); 
const mqtt = resmetry.getMQTTClient();

resmetry.on('connect', message => {
  console.log(message);
  mqtt.subscribe('CreateNewGameRequest');

});

resmetry.on('message', (topic, message) => {
  switchTopic = JSON.parse(topic);

  switch (switchTopic) {
    case 'CreateNewGameRequest':
     mqtt.publish('CreateNewGameResponse', 'Hello there', {qos:2})
    default:
      console.log('Unsupported topic!')
  };

});