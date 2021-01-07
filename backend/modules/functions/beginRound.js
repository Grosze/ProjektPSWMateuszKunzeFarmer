const driver = require('../../Neo4jDriver/driver.js');
const getRedDiceResult = require('./getRedDiceResult.js');
const getGreenDiceResult = require('./getGreenDiceResult');

module.exports = function (playerStats) {

    const redDiceResult = getRedDiceResult();
    const greenDiceResult = getGreenDiceResult();
    const playerStatsAfterDices = playerStats;

    switch (true) {
        case (redDiceResult === 'fox'):
            if (playerStatsAfterDices.smallDog > 0) {
                playerStatsAfterDices.smallDog = playerStatsAfterDices.smallDog - 1;

            } else {
                playerStatsAfterDices.rabbit = 0;

            };

            break;

        case (greenDiceResult === 'wolf'):
            if (playerStatsAfterDices.bigDog > 0) {
                playerStatsAfterDices.bigDog = playerStatsAfterDices -1;

            } else {
                for (key in playerStatsAfterDices) {
                    if (key !== 'horse' && key !== 'login') {
                        playerStatsAfterDices[key] = 0;

                    };

                };

            };

            break;
        
        case (greenDiceResult === redDiceResult):
            playerStatsAfterDices[greenDiceResult] = parseInt(playerStatsAfterDices[greenDiceResult] + Math.floor(playerStatsAfterDices[greenDiceResult]/2) + 1);
            
            break;
        
        case (greenDiceResult !== redDiceResult):
            playerStatsAfterDices[greenDiceResult] = parseInt(playerStatsAfterDices[greenDiceResult] + Math.floor((playerStatsAfterDices[greenDiceResult]+1)/2));
            playerStatsAfterDices[redDiceResult] = parseInt(playerStatsAfterDices[redDiceResult] + Math.floor((playerStatsAfterDices[redDiceResult]+1)/2));
        
            break;

        default:
            return 'error';
        
    };

    return {playerStatsAfterDices, redDiceResult, greenDiceResult};

};