
var modelLocation = '../models/Data'
var async = require('async');
var gk = require('../common');
var mq_pubhandler = require('../handler/mq_pubhandler');
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var authController = require('./AuthController');

/**  Model and route setup **/

var model = require(modelLocation).model;
var userModel = require('../models/User').model;

const route = require(modelLocation).route;
const routeIdentifier = util.format('/%s', route);

/** Express setup **/

var router = express.Router();

/** Express routing **/

 router.use('*', function (req, res, next) {
 	if (!req.user) {
        return res.status(403).send('HoenyQA, 403 - Forbidden');
    }

 	if (userModel.findOne({'_id': req.user._id}, function (err, res) {
 		if (err) {
            return res.send(err);
        }

 		next();
 	}));
 });

 router.get(routeIdentifier+'/list', function(req, res, next) {
 	model.find({'owner':req.user._id}, function (err, objects) {
 		if (err) return res.send(err);
 		return res.json(objects);
 	});
 });
 
 
router.get(routeIdentifier+'/appruncount/weekly/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select * from appruncount where project_id = ? and date >= now() - interval 1 week order by date';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');
	 	
	 	var result = new Object();
		var weeklyArr = [];

	 	for(var i=0; i<rows.length; i++){
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

router.get(routeIdentifier+'/most/sessionbyappver/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select appversion, count(*) as count from sessions where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});
});

router.get(routeIdentifier+'/most/errorbyappver/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select appversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

router.get(routeIdentifier+'/most/errorbydevice/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select device, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by device order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

router.get(routeIdentifier+'/most/errorbysdkversion/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select sdkversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by sdkversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

router.get(routeIdentifier+'/most/errorbycountry/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select country, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by country order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

router.get(routeIdentifier+'/most/errorbyclassname/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select lastactivity, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by lastactivity order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});


 router.get(routeIdentifier+'/error_instances/weekly/:id', function (req, res, next) {
   var key = req.params.id;
   var queryString = 'SELECT * from error_instances where error_id = ? AND date >= now() - interval 1 week';

   connection.query(queryString, [key], function(err, rows, fields) {
   res.header("Access-Control-Allow-Origin", "*");
   if (err) throw err;
   res.json(rows);

   });
 });

 router.get(routeIdentifier+'/appruncount/weekly/:id',, function(req, res, next) {
   var data = { 'tag':'appruncount_weekly','data': req.params.id};
   async.series([
        function (cb) {
            var ret = mq_pubhandler.publish(queueName, data);
            cb();
        }
    ], function (err) {
        var result = { 'state': 'success' };
        res.send(result);
    });

 });

// TODO : DELETE THIS ON RELEASE
router.post(routeIdentifier+'/api/client/test', function(req, res) {
  console.log(req.body)
  res.send(req.body)
});

// SESSION
router.post(routeIdentifier+'/api/client/session', function(req, res) {
  // TODO : Handle data from client
  // REFERENCE : https://github.com/UrQA/Api_Backand/blob/master/controllers/url_control.js#L24
  var result = {
    'state': 'success'
  };
  res.send(result);
});

module.exports = router;
