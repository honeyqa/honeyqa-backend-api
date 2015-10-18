
var modelLocation = '../models/Data'

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

/*
 * GET /list
 *
 */

 router.get(routeIdentifier+'/list', function(req, res, next) {
 	model.find({'owner':req.user._id}, function (err, objects) {
 		if (err) return res.send(err);
 		return res.json(objects);
 	});
 });

/*
 * GET /create
 *
 */

 router.get(routeIdentifier+'/create', function(req, res, next) {
 	req.body.owner = req.user._id;
 	model.create(req.query, function (err, entry) {
 		if (err) return next(err);
 		return res.json({
            status: 'Success',
            message: 'Item created!'
        });
 	});
 });

/*
 * GET /get/:id
 *
 */

 router.get(routeIdentifier+'/get/:id', function (req, res, next) {
 	model.findOne({
        '_id':req.params.id,
        'owner':req.user._id
    }, function (err, entry){
 		if(err) return res.send(err);
 		return res.json(entry);
 	});
 });

/*
 * GET /update/:id
 *
 */

 router.get(routeIdentifier+'/update/:id', function(req, res, next) {
 	model.findOneAndUpdate({
        '_id':req.params.id,
        'owner':req.user._id
    },
    req.query,
    function (err, entry) {
 		if (err) return res.send(err);
 		return res.json({status: 'Success', message: 'Updated item'});
 	});
 });

/*
 * GET /delete/:id
 *
 */

router.get(routeIdentifier+'/delete/:id', function (req, res, next) {
  model.findOneAndRemove({
        '_id':req.params.id,
        'owner':req.user._id
    },
    req.body,
    function (err, entry) {
        if (err) return res.send(err);
        return res.json({status: 'Success', message: 'Deleted item'});
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
