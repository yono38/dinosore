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
// database driver
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// bootstrapped RESTful API
var restify = require('express-restify-mongoose');

// Initialize database
mongoose.connect('mongodb://localhost/dinosore');

// HTTPS Key/Cert
var key = fs.readFileSync(path.join(__dirname, 'server.key'));
 certificate = fs.readFileSync(path.join(__dirname, 'server.crt'));
credentials = {key: key, cert: certificate};

// MODELS

var User = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	birthday: { type: Number, required: true },
	gender: { type: String, required: true },
	last_checkup: { type: Number }
});

var UserModel = mongoose.model('User', User);

var Symptom = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 },
	bug: { type: String},
	retired: { type: Boolean, default: false }
});

var SymptomModel = mongoose.model('Symptom', Symptom);

var Doctor = new Schema({
	title: { type: String, required: true }
});

var DoctorModel = mongoose.model('Doctor', Doctor);

var Medication = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 },
	bug: { type: String },
	retired: { type: Boolean, default: false }
});

var MedicationModel= mongoose.model('Medication', Medication);

var Bug = new Schema({
	assignedTo: { type: String, ref: 'Doctor' },	
	details: { type: String, default: '' },
	priority: { type: Number, default: 0 },
	status: {type: String, default: 'Active' },
	count: { type: Number, default: 0 },
	doctor: { type: Schema.Types.Mixed },
	medication: { type: Array },
	symptom: { type: Array },
	title: { type: String, default: 'New Bug' },
	user: { type: String, required: true }
});

var BugModel = mongoose.model('Bug', Bug);
	
var PlusOne = new Schema({
	date: { type: Number },
    user: { type: String, ref: 'User', required: true },	
    severity: { type: Number },
    notes: { type: String },	
    item: { type: String, required: true },	
	type: { type: String, required: true },
	parent: {type: String },
	parentType: {type: String }
});

var PlusOneModel = mongoose.model('PlusOne', PlusOne);

var Appointment = new Schema({
	bug : { type: String, ref: 'Bug' },
	doctor: { type: Schema.Types.Mixed },
	type: { type: String },
	condition: { type: Schema.Types.Mixed },
	user: { type: String, required: true },
	date: { type: Number, required: true },
	title: { type: String, required: true},
	notes: {type: String }
});

var AppointmentModel = mongoose.model('Appointment', Appointment);

var BetaUser = new Schema({
	name: { type: String },
	email: {type: String },
	device: {type: String }
});

var BetaModel = mongoose.model('BetaUser', BetaUser);

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
    restify.serve(app, UserModel);
    restify.serve(app, DoctorModel);
    restify.serve(app, SymptomModel);
    restify.serve(app, MedicationModel);
    restify.serve(app, BugModel);
    restify.serve(app, AppointmentModel);
    restify.serve(app, PlusOneModel);
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