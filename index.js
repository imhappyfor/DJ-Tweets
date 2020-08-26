var static = require('node-static');
var http = require('http');


var file = new static.Server({
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    indexFile: "./public/index.html"
  });


    http.createServer(function (req, res) {
        file.serve(req, res);
    }).listen(8080);

console.log('Listening on localhost:8080');