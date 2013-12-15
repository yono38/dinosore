var mongoose = require('mongoose');
// main web server
var https = require('https');
var http = require('http');
var express = require('express');
var path = require('path');
// used for authentication
/*var MongoStore = require('connect-mongo')(express);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;*/
var fs = require('fs');
// bootstrapped RESTful API
var restify = require('express-restify-mongoose');

// Initialize database
mongoose.connect('mongodb://localhost/dinosore');

// HTTPS Key/Cert
var key = fs.readFileSync(path.join(__dirname, 'server.key'));
 certificate = fs.readFileSync(path.join(__dirname, 'server.crt'));
credentials = {key: key, cert: certificate};

// MODELS
var models = require('./Schema');

// SET UP SERVER
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
};

app.configure(function(){
    app.use(allowCrossDomain);
    app.use(express.bodyParser());
	app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(express.vhost('www.dinoso.re', app));
    restify.serve(app, models.User);
    restify.serve(app, models.Doctor);
    restify.serve(app, models.Symptom);
    restify.serve(app, models.Medication);
    restify.serve(app, models.Bug);
    restify.serve(app, models.Appointment);
    restify.serve(app, models.PlusOne);
	app.use('/', express.static(path.join(__dirname, '../launch')));
//	app.use(function(req, res) {
	//	res.sendfile(path.join(__dirname, 'source/index.html'));
//	});
});

app.post('/beta', function(req, res){
	console.log(req.body);
	var betausr = new BetaModel({
		name: req.body.name,
		email: req.body.email,
		device: req.body.device
	});
	betausr.save(function(err){
		if (err) console.log(err);
		res.end('Success!');
	});
});

var httpServer = http.createServer(app).listen(3000, function() {
	console.log('Express HTTP server listening on port 3000')
});

https.createServer(credentials, app).listen(443, function() {
    console.log("Express HTTPS server listening on port 443");
});