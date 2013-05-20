var restify = require('restify'),
    server  = restify.createServer();

server.get('/screenshot', function (req, resp, next) {
    resp.send('Hello');
});

server.get('/', function (req, resp, next) {
    console.log('WTF? YELLOW! duh!');
    resp.send('Hi! hello! ola! hail1');
});

module.exports = function () {
    return server;
};
