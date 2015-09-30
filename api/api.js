var express = require('express');
var app = express(),amqp = require('amqp');
var crash = require('../router/crash.js');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {

  res.send('HoneyQA API Server');

});

app.post('/api/client/exception', function(req, res) {

  res.send(req.body);
  
});


app.post('/api/client/exception/native', function(req, res){
  
  crash.insertLog(req,res);
  
});
      

var server = app.listen(7707, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('HoneyQA REST API Server Started:%s', port);

});