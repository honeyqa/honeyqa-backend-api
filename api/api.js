var express = require('express');
var app = express();
var crash = require('../router/crash.js');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('HoneyQA API Server');
});

// TODO : DELETE THIS ON RELEASE
app.post('/api/client/test', function(req, res) {
  console.log(req.body)
  res.send(req.body)
});

app.post('/api/client/exception', function(req, res) {
  crash.insertLog(req, res);
});

app.post('/api/client/exception/native', function(req, res) {
  crash.insertLog(req, res);
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('HoneyQA REST API Server Started:%s', port);
});
