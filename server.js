var express = require('express');
var api = require('./api.js');
var config = require('./config.js');
var app = express();

app.use('/api', api);

var server = app.listen(config.apiServerPort, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Start server: http://%s:%s', host, port);
});
