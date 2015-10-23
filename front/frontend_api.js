var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
	multipleStatements : 'true'
});
var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Honeyqa API Server Started: %s', port);
});

connection.connect(function(err){
	if(!err){
		console.log('Database is connected ... \n\n');
	}else{
		console.log('Error connecting database ... \n\n');
	}
});


app.get('/', function(req, res){
	res.send('Honeyqa API');
});

app.get('/appruncount/weekly/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select * from appruncount where project_id = ? and date >= now() - interval 1 week order by date';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');
	 	
	 	var result = new Object();
		var weeklyArr = [];

	 	for(var i=0; i<rows.length; i++){
	 		var element = new Object();
	 		element.error_count = rows[i].error_count;
	 		element.session_count = rows[i].session_count;
	 		element.date = rows[i].date;
	 		weeklyArr.push(element);
	 	}

	 	result.weekly = weeklyArr;
		res.send(result);
	});
});

app.get('/most/sessionbyappver/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select appversion, count(*) as count from sessions where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});
});

app.get('/most/errorbyappver/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select appversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by appversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/most/errorbydevice/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select device, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by device order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/most/errorbysdkversion/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select sdkversion, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by sdkversion order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/most/errorbycountry/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select country, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by country order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/most/errorbyclassname/:id', function(req, res){
	var key = req.params.id;
	var queryString = 'select lastactivity, count(*) as count from error_instances where project_id = ? and date >= now() - interval 1 week group by lastactivity order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

