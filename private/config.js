
var crypto = require('crypto');

module.exports = {

	DB_PATH: '',
	PORT: 0,

	SESSION_SECRET_KEYS: [
        crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex'),
        crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')
    ],
}
