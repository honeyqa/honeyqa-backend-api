//'use strict';
var gk   = require('../common');
var amqp = require('amqp');

exports.LOGER_EXCHANGE_NAME     = gk.config.mqExchangeName;
exports.LOGER_QUEUE_NAME        = gk.config.mqQueueName;
var connection                  = amqp.createConnection(gk.config.mq);

var self            = this;
var _queue          = [];
var _isReady        = false;
var MAX_RETRY_COUNT = 5;
var retry           = 3;


connection.addListener('ready', function () {
  console.log("connected to " + connection.serverProperties.product);
  var exchange = connection.exchange(exports.LOGER_EXCHANGE_NAME ,{ type:"fanout", durable:true } );
  _queue[exports.LOGER_QUEUE_NAME] = exchange;
  _isReady = true;
});


process.addListener('exit', function () {
  console.log('Queue Exit '); 
});


exports.publish = function(queueName, msg) {
  var retVal;
  retry = retry || 0;
  if (retry > MAX_RETRY_COUNT){
    return; 
  }

  if (_queue.hasOwnProperty(queueName)) {
    //console.log("publishing message");
    var ex = _queue[queueName];
    ex.publish(queueName, msg);
  } else {
    // TODO: binding queue automatically
    _isReady = false;
  }
  
  //global.gc(true);
};


