/**
 * HoneyQA backend
 *
 * Main execution file for HoneyQA RESTful API project.
 */

 /** External modules **/
 var express = require('express');
 var bodyParser = require('body-parser');
 var session = require('cookie-session');
 var cookieParser = require('cookie-parser');
 var passport = require('passport');

 /** Internal modules **/
 var config = require('./private/config');
 var authController = require('./controllers/AuthController');
 var userController = require('./controllers/UserController');
 var DataController = require('./controllers/DataController');

 /** Database setup **/

 /** Express setup **/
 var app = express();

 app.set('trust proxy',1) // trust first proxy
 app.set('json spaces',4);
 app.use(cookieParser());
 app.use(bodyParser.urlencoded({ extended: false}));
 app.use(session({
    keys: config.SESSION_SECRET_KEYS,
    cookie: { maxAge: 60000 }
 }))
 app.use(passport.initialize());
 app.use(passport.session());

 /** API routing **/

 app.use('*', function (req, res, next) {
 	console.log("METHOD:",req.method,req.originalUrl,"| USER:",req.user !== undefined ? req.user.username : "undefined");
 	next();
 });

 app.use('/', authController.router);
 app.use('/', userController);
 app.use('/', authController.isAuthenticated);
 app.use('/', DataController);
 app.all('*', function (req, res){
 	res.status(403).send('HoneyQA, 403 - Forbidden');
 })

 /** Server deployment **/
 var port = config.PORT || 80;
 app.listen(port)

 console.log('\n--- HoneyQA Information ---');
 console.log('  Port:',port);
 console.log('  Database:',config.DB_PATH);
 console.log('  Cookie Session Keys:');

 for (i in config.SESSION_SECRET_KEYS) {
    console.log('    - '+config.SESSION_SECRET_KEYS[i]);
 }
