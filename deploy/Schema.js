// database driver
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
var User = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	birthday: { type: Number, required: true },
	gender: { type: String, required: true },
	last_checkup: { type: Number }
});

module.exports.User = mongoose.model('User', User);

var Symptom = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 },
	bug: { type: String},
	retired: { type: Boolean, default: false }
});

module.exports.Symptom = mongoose.model('Symptom', Symptom);

var Doctor = new Schema({
	title: { type: String, required: true }
});

module.exports.Doctor = mongoose.model('Doctor', Doctor);

var Medication = new Schema({
	title: { type: String, required: true },
	user: { type: String, required: true },	
	count: { type: Number, default: 0 },
	bug: { type: String },
	retired: { type: Boolean, default: false }
});

module.exports.Medication = mongoose.model('Medication', Medication);

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

module.exports.Bug = mongoose.model('Bug', Bug);
	
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

module.exports.PlusOne= mongoose.model('PlusOne', PlusOne);

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

module.exports.Appointment = mongoose.model('Appointment', Appointment);

var BetaUser = new Schema({
	name: { type: String },
	email: {type: String },
	device: {type: String }
});

module.exports.Beta = mongoose.model('BetaUser', BetaUser);