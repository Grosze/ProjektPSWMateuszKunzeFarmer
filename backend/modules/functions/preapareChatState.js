module.exports = function(chats, login) {
    const chatsState = {};
    logins = [];
    inputs = {}

    chats.forEach(element => {
        chatsState[element.users.filter(x => x !== login)[0]] = element.chat;
        inputs[element.users.filter(x => x !== login)[0]] = '';
        logins.push(element.users.filter(x => x !== login)[0]);
    });

    return {
        users: logins,
        chats: chatsState,
        inputs: inputs
    };  

};