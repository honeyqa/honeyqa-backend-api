var express = require('express');
var app = express();
var crash = require('../router/crash.js');
var bodyParser = require('body-parser'),
User = db.model('User'),

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

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

app.post('/api/client/exception', function(req, res) {
  crash.insertLog(req, res);
});

app.post('/api/client/exception/native', function(req, res) {
  crash.insertLog(req, res);
});

app.post('/:project_id', function (req, res) {
    if (!req.params.project_id) res.json({ code : 101, message: "failed" });
    Project.findById(req.params.project_id, function (err, projects) {
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
        projects.save(function (err) {
            if (err) res.json({ code: 100, message: "unknown error" });
            res.json({ code: 200, message: "success" });
        });
    });
});

app.post('/login', function (req, res) {
    if (!req.body.email || !req.body.password) res.json({ code : 101, message : "failed" });

    User.findOne({ "email" : req.body.email, "password" : req.body.password }, function (err, user) {
        if (!user) res.json({ code : 102, message : "no account" });
        res.json(user);
    });
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('HoneyQA REST API Server Started:%s', port);
});
