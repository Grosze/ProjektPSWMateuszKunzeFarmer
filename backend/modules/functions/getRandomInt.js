module.exports =  function (min, max) {
    return min + Math.floor((max + 1 - min) * Math.random());
    
};
