
var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app
  .use(express.logger())
  .use('/',express.static(__dirname + '/.tmp'));

server
  .listen(1337);

