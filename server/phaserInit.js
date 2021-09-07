// to make a virtual dom to run phaser on server without a browser
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;

// initializes headless phaser instance on the server
function phaserInit(io, __dirname) {
    JSDOM.fromFile('server/index.html', {
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true
    }).then((dom) => {
        dom.window.gameLoaded = () => {
            dom.window.io = io;
            dom.window.__dirname = __dirname;
        };
    });
}

module.exports.phaserInit = phaserInit;
