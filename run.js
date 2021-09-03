/////////////////////////////
// Constants and Variables //
/////////////////////////////

const easystarjs = require('easystarjs')
const express = require('express');

// frameworks + middleware

// default port is 8081, but if it's in "/opt/magegame-dev/" it should listen on the dev port (8082)
let port = 8081;
if (__dirname.includes("-dev")) {
    port = 8082;
}

const fqdn = 'localhost';
const uri = "/";
const url = fqdn + ':' + port + uri;

const app = express();
const http = require('http')
const server = http.createServer(app);


//////////////////////
// Middleware Setup //
//////////////////////

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


///////////////////
// Server listen //
///////////////////

server.listen(port, function() {
    console.log(`Listening: ${url}`);
});
