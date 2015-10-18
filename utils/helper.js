'use strict';

//var _config = require(__dirname + '/../config');

var _code   = {
  "Success": 0,
  "GeneralError": 1,

  "What": 99999
}

exports.generateResult = function(data, state, err) {
  var result = { 'success': true, };

  if (err) {
    var code = _code[err];
    code = code || 99999;
    //result = { 'success': false, 'code': code, 'msg': err };
    result = { 'success': false, 'msg': err };
  };
  return data['result'] = result;
}
