/////////////////////////////
// Constants and Variables //
/////////////////////////////

const express = require('express');

// frameworks + middleware

// default port is 8081, but if it's in "/opt/magegame-dev/" it should listen on the dev port (8082)
let port = 8083;
if (__dirname.includes("-dev")) {
    port = port + 1;
}

const protocol = 'http://'
const fqdn = 'localhost';
const uri = "/";
const url = protocol + fqdn + ':' + port + uri;

const app = express();
const http = require('http')
const server = http.createServer(app);
const {
    socket
} = require('./socket')
const easystar = require('easystarjs')

//////////////////////
// Middleware Setup //
//////////////////////

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



//Initializes phaser instance on the server to find the truth
const {
    phaserInit
} = require('./server/phaserInit');


///////////////////
// Server listen //
///////////////////

server.listen(port, () => {
    // TODO: might need to shunt easystar into server.js here
    phaserInit(socket(server), __dirname, easystar);

    console.log(`Listening: ${url}`);
});
/*
server.listen(port, function () {
    console.log(`Listening: ${url}`);
});
*/
