var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose');

mongoose.connect('mongodb://localhost/dinosore');

// MODELS
// TODO put in sep directories?
var Color = new Schema({
    color: { type: String, required: true },
    hex: { type: String, required: true },
		createdAt: { type: Number },
		upNumberdAt: { type: Number }
});

var ColorModel = mongoose.model('Color', Color);

var User = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	birthday: { type: Number },
	last_checkup: { type: Number }
});

var UserModel = mongoose.model('User', User);

var Symptom = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 }
});

var SymptomModel = mongoose.model('Symptom', Symptom);

var Doctor = new Schema({
	title: { type: String, required: true }
});

var DoctorModel = mongoose.model('Doctor', Doctor);

var Medication = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 }
});

var MedicationModel= mongoose.model('Medication', Medication);

var Bug = new Schema({
	assignedTo: { type: String, ref: 'Doctor' },	
	bugDetails: { type: String, default: '' },
	bugPriority: { type: Number, default: 0 },
	bugStatus: {type: String, default: 'Open' },
	color: { type: String, ref: 'Color' },	
	medicatons: { type: Array },
	symptoms: { type: Array },
	tests: { type: Array },
	title: { type: String, default: 'New Bug' },
	user: { type: String, required: true }
});

var BugModel = mongoose.model('Bug', Bug);
	
var PlusOne = new Schema({
	date: { type: Number },
    user: { type: String, ref: 'User', required: true },	
    item: { type: String, required: true },	
	type: { type: String, required: true },
});

var PlusOneModel = mongoose.model('PlusOne', PlusOne);

var Appointment = new Schema({
	bug : { type: String, ref: 'Bug' },
    doctor: { type: String, ref: 'Doctor' },	
	user: { type: String, required: true },
	date: { type: Number, required: true },
	title: { type: String, required: true},
});

var AppointmentModel = mongoose.model('Appointment', Appointment);

// SET UP SERVER
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
};

app.configure(function(){
//    app.use(allowCrossDomain);
    app.use(express.bodyParser());
	app.use(express.logger('dev'));
    app.use(express.methodOverride());
    restify.serve(app, ColorModel);
    restify.serve(app, UserModel);
    restify.serve(app, DoctorModel);
    restify.serve(app, SymptomModel);
    restify.serve(app, MedicationModel);
    restify.serve(app, BugModel);
    restify.serve(app, AppointmentModel);
    restify.serve(app, PlusOneModel);
	app.use('/', express.static(path.join(__dirname, 'source')));
//	app.use(function(req, res) {
	//	res.sendfile(path.join(__dirname, 'source/index.html'));
//	});
});

http.createServer(app).listen(3000, function() {
    console.log("Express server listening on port 3000");
});
