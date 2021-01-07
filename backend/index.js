//imports

const beginRound = require('./modules/functions/beginRound.js');
const handleExchange = require('./modules/functions/handleExchange');
const didWon = require('./modules/functions/didWon.js');

//express

const express = require('express');
const app = express();
const port = 2137;

//mqtt

const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

//neo4j

const driver = require('./Neo4jDriver/driver.js');
const neo4j = require('neo4j-driver');

//Aktywacja localhost

app.listen(port, () => {
    console.log('Server running on port ' + port);
    
});

app.use(express.json());

//Endpointy

//Logowanie

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

//Tworzenie i dołączanie do pokoji jako gracz lub obserwujący

app.post('/CreateGame', async (req, res) => {
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

    };

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

//Enpointy związane z rozgrywką

app.post('/StartGame/:id', async (req, res) => {
    try {
        const id = neo4j.int(req.params.id);

        const session = driver.session();

        const getPlayers = await session.run(
            'Match (a:Player)-[:IS_PLAYING]->(b:Game) WHERE ID(b) = $id RETURN a.login',
            {id}
        );
        
        const playersList = getPlayers.records.map(x => x._fields[0]);
        
        await session.run(
            'Match (b:Game) WHERE ID(b) = $id SET b.players = $playersList, b.turn = b.players[0]',
            {id, playersList}
        );

        playersList.forEach(async (login) => {
            const session = driver.session();

            await session.run(
                'Match (a:Player) WHERE a.login = $login SET a.sheep = 0, a.rabbit = 0, a.pig = 0, a.cow = 0, a.horse = 0, a.smallDog = 0, a.bigDog = 0',
                {login}
            );

            session.close();

        });

        const gameData = await session.run(     
            'MATCH (b:Game) WHERE ID(b) = $id RETURN b',
            {id}
        )
        .then((res) => {
            return res.records[0]._fields[0].properties;
        });

        const whichPlayerTurnIsNow = gameData.turn;

        const playerStats = await session.run(
            'MATCH (a:Player)-[:IS_PLAYING]->(b:Game) WHERE ID(b) = $id AND a.login = $whichPlayerTurnIsNow RETURN a',
            {id, whichPlayerTurnIsNow}
        )
        .then((res) => {
            return res.records[0]._fields[0].properties;
        });

        const playerStatsAfterDices = beginRound(playerStats);

        await session.run(
            'MATCH (a:Player)-[:IS_PLAYING]->(b:Game) WHERE ID(b) = $id AND a.login = $login SET a.rabbit = $rabbit, a.sheep = $sheep, a.pig = $pig, a.cow = $cow, a.horse = $horse, a.smallDog = $smallDog, a.bigDog = $bigDog',
            {...playerStatsAfterDices['playerStatsAfterDices'], id}
        );

        session.close();

        return res.send({...playerStatsAfterDices});

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/:login/Exchange/:id', async (req, res) => {
    try {
        const id = neo4j.int(req.params.id);
        const login = req.params.login;
        const from = req.body.from;
        const to = req.body.to;

        const session = driver.session();

        const auth = await session.run(
            'Match (b:Game) WHERE ID(b) = $id RETURN b.turn',
            {id}
        );

        const whichPlayerTurnIsNow = auth.records[0]._fields[0];

        if (whichPlayerTurnIsNow === login) { 
            const playerStats = await session.run(
                'MATCH (a:Player)-[:IS_PLAYING]->(b:Game) WHERE ID(b) = $id AND a.login = $login RETURN a',
                {id, login}
            ).then((res) => {
                return res.records[0]._fields[0].properties;
            });

            const playerStatsAfterExchange = handleExchange(playerStats, from, to);

            await session.run(
                'MATCH (a:Player) WHERE a.login = $login SET a.rabbit = $rabbit, a.sheep = $sheep, a.pig = $pig, a.cow = $cow, a.horse = $horse, a.smallDog = $smallDog, a.bigDog = $bigDog',
                {...playerStatsAfterExchange}
            );

            const checkIfPlayerWon = didWon(playerStatsAfterExchange);

            if (checkIfPlayerWon === true) {
                session.close();

                return res.send({result:1});

            } else {
                session.close();

                return res.send({result:0});

            };

        } else {
            session.close();

            return res.send({result:0});

        };

    } catch (err) {
        return res.send({result:'error'});

    };

});

app.post('/:login/EndTurn/:id', async (req, res) => {
    try {
        const id = neo4j.int(req.params.id);
        const login = req.params.login;

        const session = driver.session();

        const auth = await session.run(
            'Match (b:Game) WHERE ID(b) = $id RETURN b.turn',
            {id}
        );

        const whichPlayerTurnIsNow = auth.records[0]._fields[0];

        if (whichPlayerTurnIsNow === login) { 

            const gameData = await session.run(     
                'MATCH (b:Game) WHERE ID(b) = $id RETURN b',
                {id}
            )
            .then((res) => {
                return res.records[0]._fields[0].properties;
            });

            const players = [...gameData.players.slice(1),gameData.players[0]];
            const turn = players[0];

            await session.run(     
                'MATCH (b:Game) WHERE ID(b) = $id SET b.players = $players, b.turn = $turn',
                {id, players, turn}
            );

            

            session.close();

            return res.send({result:'your turn!'});

        } else {
            session.close();

            return res.send({result:'not your turn!'});

        };  

    } catch (err) {
        return res.send({result:'error'});

    };

});


//Enpointy związane z chatem

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
