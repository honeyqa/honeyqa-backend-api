exports.iOSExceptionCheck = function(data) {
  try {
    var a = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

exports.androidExceptionCheck = function(data) {
  try {
    var a = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}
