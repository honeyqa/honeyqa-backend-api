var mysql = require('mysql');
var config = require('../private/config.js');
var connection;

function startConnection () {
	if (!!connection &&
		connection.state !== 'protocol_error' &&
		connection.state !== 'disconnected') return;

	connection = mysql.createConnection({
		host: config.dbHost,
		user: config.dbUser,
		password: config.dbPassword,
		database: config.dbName
	});
	connection.connect(function (err) {
		console.log('MYSQL [connected].');

		if (err) {
			console.log('MYSQL [error]:', err);

			if (err.code === 'ECONNREFUSED') {
				console.log('MYSQL [server not found].');
			}
				setTimeout(startConnection, 2000);
			}
		}
	});

	connection.on('error', function (err) {
		console.log('MYSQL [error]:', err);

		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.log('MYSQL [disconected].');


			startConnection();
		} else {
			throw err;
		}
	});
}


startConnection();

module.exports = {
	query: function (sql, callback) {
		startConnection();

		if (connection.state !== 'disconnected') {
			console.log('MYSQL [query]: %s', sql);

			connection.query(sql, callback);
		} else {
			callback(new Error('MYSQL [no connection]'));
		}
	}
};
