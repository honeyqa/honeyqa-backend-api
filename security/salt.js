var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function getRandom(max) {
  return Math.floor(Math.random() * (max + 1));
}

module.exports = function(length) {
  var salt = "";
  for (var i = 0; i < length; i++) {
    salt += s.substr(getRandom(61), 1);
  }
  return salt;
};
