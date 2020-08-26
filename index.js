var static = require('node-static');
var http = require('http');

var file = new(static.Server)('./public');

    http.createServer(function (req, res) {
        file.serve(req, res);
    }).listen(8080);

console.log('Listening on localhost:8080');