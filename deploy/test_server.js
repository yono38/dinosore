var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose');

mongoose.connect('mongodb://localhost/dinosore_test');

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
    restify.serve(app, models.User);
    restify.serve(app, models.Doctor);
    restify.serve(app, models.Symptom);
    restify.serve(app, models.Medication);
    restify.serve(app, models.Bug);
    restify.serve(app, models.Appointment);
    restify.serve(app, models.PlusOne);
	app.use('/', express.static(path.join(__dirname, '../source')));
	app.get('/', function(req, res){
		res.redirect('/test/SpecRunner.html');
	});
//	app.use(function(req, res) {
	//	res.sendfile(path.join(__dirname, 'source/index.html'));
//	});
});

http.createServer(app).listen(5555, function() {
    console.log("Test server listening on port 5555");
});
