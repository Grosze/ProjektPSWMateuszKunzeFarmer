//express

const express = require('express');
const app = express();
const port = 2137

//mqtt

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

//neo4j

const driver = require('./Neo4jDriver/driver.js');
const neo4j = require('neo4j-driver');

//Aktywacja localhost

app.listen(port, () => {
    console.log('Server running on port '+port);
    
});

app.use(express.json());

//Endpointy

app.post('/LogIn', async (req, res) => {
    try {
        const login = req.body.login;

        const session = driver.session();
        
        await session
            .run(
                'MERGE (a: Player {login: $login}) ON CREATE SET a.res = 0 ON MATCH SET a.res = 1',
                 {login}
            );
        
        session.close();

        return res.send({result: 0});

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/CreateNewGame', async (req, res) => {
    try {
        const session = driver.session();
        
        await session
            .run(
                'CREATE (a: Game {chat:[]})'
            );

        session.close();
        
        return res.send({result: 0});

    } catch (err) {
        return res.send({result:'error'});

    }
});

app.post('/:login/JoinGame/:id', async (req, res) => {
    try {
        const login = req.params.login;
        const id = neo4j.int(req.params.id);

        const session = driver.session();
        
        const auth = await session
            .run(
                'MATCH (a:Player)-[r:IS_PLAYING]->(b:Game) WHERE ID(b) = $id return a.login',
                {id}
            );

        playersLimit = auth.records.length;
        isAlreadyInRoom = auth.records.filter(x => x._fields[0] === login).length;
        
        if (playersLimit < 4 && isAlreadyInRoom === 0) {
            await session
                .run(
                    'MATCH (a: Player),(b: Game) WHERE ID(b) = $id AND a.login = $login CREATE (a)-[r:IS_PLAYING]->(b) RETURN r',
                    {login, id}
                );
            
            session.close();

            return res.send({result:'joined!'});

        } else {
            session.close();

            return res.send({result:'full or already in the room!'});

        };

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/:login/SpectateGame/:id', async (req, res) => {
    try {
        const login = req.params.login;
        const id = neo4j.int(req.params.id);

        const session = driver.session();
        
        const auth = await session
            .run(
                'MATCH (a:Player)-[r:IS_SPECTATING]->(b:Game) WHERE ID(b) = $id return a.login',
                {id}
            );
        
        isAlreadySpectating = auth.records.filter(x => x._fields[0] === login).length;

        if (isAlreadySpectating === 0) {
            await session
                .run(
                    'MATCH (a: Player),(b: Game) WHERE ID(b) = $id AND a.login = $login CREATE (a)-[r:IS_SPECTATING]->(b) RETURN r',
                    {login, id}
                );

                session.close();

                return res.send({result:'Spectating!'});

        } else {
            session.close();

            return res.send({result:'Already spectating!'});
        }
    } catch (err) {
        return res.send({result:'error'});

    };
    
});

app.post('/:login/PostMessage/:id', async (req, res) => {
    try {
        const login = req.params.login;
        const id = neo4j.int(req.params.id);
        const message = req.body.message;

        const record = login + '/' + message;

        const session = driver.session();
        
        const auth = await session
            .run(
                'MATCH (a:Player)-[]->(b:Game) RETURN a.login',
                {id}
            );
        
        isInGame = auth.records.filter(x => x._fields[0] === login).length;

        if (isInGame === 1) {
            await session
                .run(
                    'MATCH (a:Game) WHERE ID(a)=120 SET a.chat = a.chat + $record return a',
                    {record}
                );
            
            session.close();
            
            return res.send({result: 0});

        } else {
            session.close();

            return res.send({result:'Not attending in Game!'})

        };

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/:firstLogin/CreateChatRoom/:secondLogin', async (req, res) => {
    try {
        const firstLogin = req.params.firstLogin;
        const secondLogin = req.params.secondLogin;

        const session = driver.session();

        await session.run(
            'MATCH (b:Player {login:"JS"}),(c:Player {login:"JD"}) CREATE (a:ChatRoom {chat:[]}), (b)-[:IS_CHATTING]->(a),(c)-[:IS_CHATTING]->(a)',
            {firstLogin, secondLogin}
        );

        session.close();

        return res.send({result:0});

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/:loginFrom/PostAMessageTo/:loginTo', async (req, res) => {
    try {
        const sender = req.params.loginFrom;
        const receiver = req.params.loginFrom;
        const message = req.body.message;

        const record = sender + '/' + message;

        const session = driver.session();

        
        await session.run(
            'MATCH (a: ChatRoom),(b: Player {login: $sender}),(c: Player {login: $receiver}) WHERE (b)-[:IS_CHATTING]->(a) AND (c)-[:IS_CHATTING]->(a) SET a.chat = a.chat + $record',
            {sender, receiver, record}
        );

        session.close();

        return res.send({result:0});
       
    } catch (err) {
        return res.send({result:'error'});

    };

});
