var modelLocation = '../models/Data'
var async = require('async');
var gk = require('../common');
var mq = require('../handler/mq_pubhandler');
var util = require('util');
var express = require('express');
var redisHandler = require('../handler/crashStat.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var dataChecker = require('../security/valid.js');
var authController = require('./AuthController');

/**  Model and route setup **/

var model = require(modelLocation).model;
var userModel = require('../models/User').model;

const route = require(modelLocation).route;
const routeIdentifier = util.format('/%s', route);

/** Express setup **/

var router = express.Router();

/** Express routing **/

router.use('*', function(req, res, next) {
  if (!req.user) {
    return res.status(403).send('HoenyQA, 403 - Forbidden');
  }

  if (userModel.findOne({
      '_id': req.user._id
    }, function(err, res) {
      if (err) {
        return res.send(err);
      }

      next();
    }));
});

router.get(routeIdentifier + '/list', function(req, res, next) {
  model.find({
    'owner': req.user._id
  }, function(err, objects) {
    if (err) return res.send(err);
    return res.json(objects);
  });
});


router.get(routeIdentifier + '/appruncount/weekly/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select * from appruncount where project_id = ? and date >= now() - interval 1 week order by date';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    var weeklyArr = [];

    for (var i = 0; i < rows.length; i++) {
      var element = new Object();
      element.error_count = rows[i].error_count;
      element.session_count = rows[i].session_count;
      element.date = rows[i].date;
      weeklyArr.push(element);
    }

    result.weekly = weeklyArr;
    res.send(result);
  });
});

router.get(routeIdentifier + '/most/sessionbyappver/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select appversion, count(*) as count from sessions where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/most/errorbyappver/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select appversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/most/errorbydevice/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select device, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by device order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/most/errorbysdkversion/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select sdkversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by sdkversion order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/most/errorbycountry/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select country, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by country order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/most/errorbyclassname/:id', function(req, res) {
  var key = req.params.id;
  var queryString = 'select lastactivity, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by lastactivity order by count(*) desc limit 1';
  connection.query(queryString, [key], function(err, rows, fields) {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');

    var result = new Object();
    result = rows[0];

    res.send(result);
  });
});

router.get(routeIdentifier + '/error_instances/weekly/:id', function(req, res, next) {
  var key = req.params.id;
  var queryString = 'SELECT * from error_instances where error_id = ? AND date >= now() - interval 1 week';

  connection.query(queryString, [key], function(err, rows, fields) {
    res.header("Access-Control-Allow-Origin", "*");
    if (err) throw err;
    res.json(rows);

  });
});

router.post(routeIdentifier + '/urqa/client/send/exception', function(req, res, next) {
  var honeydata = {};

  if (version) {
    honeydata.tag = 'android_receive_exception'
    honeydata.data = req.body.exception;
    honeydata.log = req.body.console_log.data;
    honeydata.date_time = get_cur_time();
  } else {
    honeydata.tag = 'android_receive_exception'
    honeydata.data = req.body;
    honeydata.date_time = get_cur_time();
  }

  async.series([
    function(cb) {
      mq.publish('android_receive_exception', honeydata);
      cb();
    }
  ], function(err) {
    var result = {
      'state': 'success'
    };
    res.send(result);
  });

});

router.get(routeIdentifier + '/error_instances/weekly/:id', function(req, res, next) {
  var key = req.params.id;
  var queryString = 'SELECT * from error_instances where error_id = ? AND date >= now() - interval 1 week';

  connection.query(queryString, [key], function(err, rows, fields) {
    res.header("Access-Control-Allow-Origin", "*");
    if (err) throw err;
    res.json(rows);

  });
});

// Client

// Android v1 (Default UrQA)
// Exception
router.post(routeIdentifier + '/urqa/client/send/exception', function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// Native Exception
router.post(routeIdentifier + '/urqa/client/send/exception/native', function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// Session
router.post(routeIdentifier + '/urqa/client/connect', jsonParser, function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// Key
router.post(routeIdentifier + '/urqa/client/get_key', function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// Android v2 (HoneyQA)
// Exception
router.post(routeIdentifier + '/api/v2/client/exception', jsonParser, function(req, res) {
  if (dataChecker.androidExceptionCheck(req.body)) {
    mq.publish('androidV2', req.body);
    res.status(200).send({
      response: 200
    });
  } else {
    res.status(400).send({
      response: 400
    });
  }
});

// Native Exception
router.post(routeIdentifier + '/api/v2/client/exception/native', function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// Session
router.post(routeIdentifier + '/api/v2/client/session', jsonParser, function(req, res) {
  redisHandler.clientSession(res.body.apikey, res.body, function(err, res) {});
  res.status(200).send({
    response: 200
  });
});

// Key
router.post(routeIdentifier + '/api/v2/client/key', function(req, res) {
  res.status(200).send({
    response: 200
  });
});

// iOS
// Exception
router.post(routeIdentifier + '/api/ios/client/exception', jsonParser, function(req, res) {
  if (dataChecker.iOSExceptionCheck(req.body)) {
    async.series([
      function(cb) {
        mq.publish('iOSV1', req.body);
        res.status(200).send({
          response: 200
        });
        cb();
      }
    ]);
  } else {
    res.status(400).send({
      response: 400
    });
  }
});

// Session
router.post(routeIdentifier + '/api/ios/client/session', jsonParser, function(req, res) {
  // TODO : insert data to redis
  // apikey / appversion / ios_version / model / carrier_name / country_code
  redisHandler.clientSession(res.body.apikey, res.body, function(err, res) {});
  res.status(200).send({
    response: 200
  });
});

module.exports = router;
