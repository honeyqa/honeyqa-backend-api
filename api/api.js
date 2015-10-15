var express = require('express');
var app = express();
var crash = require('../router/crash.js');
var bodyParser = require('body-parser'),
  User = db.model('User');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('HoneyQA API Server');
});

// TODO : DELETE THIS ON RELEASE
app.post('/api/client/test', function(req, res) {
  console.log(req.body)
  res.send(req.body)
});

// SESSION
app.post('/api/client/session', function(req, res) {
  // TODO : Handle data from client
  // REFERENCE : https://github.com/UrQA/Api_Backand/blob/master/controllers/url_control.js#L24
  var result = {
    'state': 'success'
  };
  res.send(result);
});

app.get('/error_instances/weekly/:id', function (req, res, next) {
  
  var key = req.params.id;
  
  var queryString = 'SELECT * from error_instances where error_id = ? AND date >= now() - interval 1 week';

  connection.query(queryString, [key], function(err, rows, fields) {
      if (err) throw err;

      res.json(rows);

  });

});

app.get('/appruncount/weekly/:id', function (req, res, next) {
  
  var key = req.params.id;
  
  var queryString = 'SELECT * from appruncount where project_id = ? AND date >= now() - interval 1 week';

  connection.query(queryString, [key], function(err, rows, fields) {
      if (err) throw err;

      res.json(rows);

  });

});

app.post('/api/client/exception', function(req, res) {
  crash.insertLog(req, res);
});

app.post('/api/client/exception/native', function(req, res) {
  crash.insertLog(req, res);
});

app.post('/:project_id', function(req, res) {
  if (!req.params.project_id) res.json({
    code: 101,
    message: "failed"
  });
  Project.findById(req.params.project_id, function(err, projects) {
    projects.error.push({
      errorMessage: req.body.errormessage,
      className: req.body.classname,
      methodName: req.body.methodname,
      fileName: req.body.filename,
      errorLine: req.body.errorline,
      errorStack: req.body.errorstack,
      osVersion: req.body.osversion,
      osArch: req.body.osarch,
      appMemTotal: req.body.memtotal,
      appMemFree: req.body.memfree,
      createdAt: new Date()
    });
    projects.save(function(err) {
      if (err) res.json({
        code: 100,
        message: "unknown error"
      });
      res.json({
        code: 200,
        message: "success"
      });
    });
  });
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('HoneyQA REST API Server Started:%s', port);
});
