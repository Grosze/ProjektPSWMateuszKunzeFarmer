const exchangeTable = require('../variables/exchangeTable.js')

module.exports = function (playerStats, from, to) {
    const nameOfExchangeInTable = from+'->'+to;
    const exchangeRate = exchangeTable[nameOfExchangeInTable];

    if (playerStats[from] - exchangeRate[0] >= 0) {
        playerStats[from] = playerStats[from] - exchangeRate[0];
        playerStats[to] = playerStats[to] + exchangeRate[1];

        return playerStats;

    } else {
        return playerStats;

    };

};