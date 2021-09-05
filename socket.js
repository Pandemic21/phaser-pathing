const {
    Server
} = require("socket.io");

function socket(server) {
    const io = new Server(server);
    return io;
}

module.exports = {
    socket
}
