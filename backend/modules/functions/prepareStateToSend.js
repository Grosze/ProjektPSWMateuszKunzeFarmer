module.exports = function(playersState, gameState) {
    const playersStats = {};

    playersState.forEach(player => {
        playersStats[player.login] = {
            rabbit: player.rabbit,
            sheep: player.sheep,
            pig: player.pig,
            horse: player.horse,
            cow: player.cow,
            smallDog: player.smallDog,
            bigDog: player.bigDog
        };

    });

    return {
        redDice: gameState.redDice,
        greenDice: gameState.greenDice,
        turn: gameState.turn,
        players: gameState.players,
        playersStats: playersStats
    };

};