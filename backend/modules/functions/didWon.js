module.exports = function (playerStats) {
    return Object.keys(playerStats).reduce((acc, current) => {
        if (['smallDog', 'bigDog', 'login', 'res'].find(x => x === current)) {
            return acc&&true;
        } else {
            if (playerStats[current] > 0) {
                return acc&&true;
            } else {
                return acc&&false;
            };
        };
    }, true);
    
};