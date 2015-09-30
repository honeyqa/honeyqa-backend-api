var amqp = require('amqplib/callback_api');
var QUEUE_NAME = 'crashTest';

var conn;
var open = require('amqplib').connect('amqp://guest:guest@localhost:5672').then(function(c) {
  console.log('connection open')
  conn = c;
});

exports.insertLog = function(req, res) {
  if (checkLogData(req.body)) {
    conn.createChannel().then(function(ch) {
      ch.assertQueue(QUEUE_NAME, {
        durable: true
      });
      if (ch.sendToQueue(QUEUE_NAME, new Buffer(data.msg), {
          persistent: true
        })) {
        insertLogSuccess(res);
      } else {
        insertLogFail(res);
      }
    }).then();
  } else {
    logDataError(res);
  }
};

function checkLogData(l) {
  try {
    JSON.parse(l);
    return true;
  } catch (e) {
    return false;
  }
}

function insertLogSuccess(res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.write('{"msg":"Message Inserted"}');
  res.end();
}

function insertLogFail(res) {
  res.writeHead(500, {
    "Content-Type": "application/json"
  });
  res.write('{"msg":"MQ Error"}');
  res.end();
}

function logDataError(res) {
  res.writeHead(400, {
    "Content-Type": "application/json"
  });
  res.write('{"msg":"Cannot parse log data"}');
  res.end();
}
