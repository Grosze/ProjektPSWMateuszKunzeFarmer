const getRandomInt = require('./getRandomInt.js');

module.exports = function () {
    const randomNumber = getRandomInt(1, 12)

    switch (true) {
        case (randomNumber <= 6):
            return 'rabbit';

        case (randomNumber > 6 && randomNumber <= 9):
            return 'sheep';

        case (randomNumber === 10):
            return 'pig';

        case (randomNumber === 11):
            return 'cow';
        
        case (randomNumber === 12):
            return 'wolf';
        
        default:
            return 'error';

    };

};