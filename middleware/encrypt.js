'use strict';

var cipher = require("../utils/cipher_utils")
var enckey_manager = require( "../utils/enckey_manager");

module.exports = function() {

	console.log('Enabled Encrypt');

	return function( req, res, next) {

		/*
		 *
		 *  this option is request of Encrypt
		 * 
		 * urqa-encrypt-opt is encrypt type
		 * this version is support only aes-256-cbc-pkcs5padding+base64 mode
		 * 
		 */
		if( req.headers['urqa-encrypt-opt'] ){
			/*
			 * encrypt request format sample
			 * 	{ token:"token", enc_data: "encrypt ,,,", src_len: 1111 }
			 */
			var token = req.body.token;
			var enc_data = req.body.enc_data;
			var src_len = req.body.src_len;

			enckey_manager.get_key_use_token( token, function( iscontained, basekey ){

				if( null == basekey ){

					// token is null...
					var result = { 'result': 'fail', 'reson' : 'Token Create Fail' };
					res.status(406).send(result);

				}else{

					var decdata = cipher.decrypt( enc_data, basekey );
					req.body = JSON.parse( decdata );
					next();

				}
			});

		} else {
			next();
		}

	};
};
