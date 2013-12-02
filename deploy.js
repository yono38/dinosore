// TODO
// run jasmine tests on dev mongo db

// - scp to jasonschapiro.com (will put in remote deploy script)
// - adm-zip build file
// usse phonegap-build-api to build app
// XX git commit / push to github (should be in build script, not deploy script)

// =================== IMPORT LIBRARIES ================= //
var fs = require('fs-extra')
, nodemailer = require('nodemailer')
, phonegap = require('phonegap')
, async = require('async')
, path = require('path')
, http = require('http')
, https = require('https')
, spawn = require('child_process');

// ============== MOVE LATEST SOURCE TO PHONEGAP ============ //
// TODO use git diff to determine exactly which files to move
var copySrcFiles = function(cb){
	console.log('copying newest source files over to phonegap/www folder..');
	console.log('Note: Doesn\'t copy over config.js');
	var copyDirs = ['css/images', 'img'];
	var targetDir = './build/phonegap/www/';
	var sourceDir = './source/';
	copyDirs.forEach(function(dir, idx, arr){
		// remove old files
		console.log("removing ", path.join(targetDir, dir));
		fs.removeSync(path.join(targetDir + dir));

		// copy over new files
		// TODO use async to make a series
		
	});
	async.each(copyDirs, function(dir, callback){
		fs.copy(path.join(sourceDir, dir), path.join(targetDir, dir), function(err){
			if (err) callback(err);
			else callback(null);
		});
	},
	function(err){
		console.log('File copy complete');
		if (cb && err) cb(err);
		else if (cb) cb(null);
	});
};

// ================== BUILD WITH PHONEGAP ============ //
function buildPhonegap(callback){
	console.log('building phonegap app for android');
	var normDir = path.normalize('build/phonegap');
	console.log('Changing directory to ' + process.cwd() + normDir);
	process.chdir(normDir);
	var spawn = require('child_process').spawn,
	 buffer = require('buffer'),
     pg = spawn('cmd', ['/c', 'phonegap run android']);

	pg.stdout.on('data', function (data) {
	  var buf = new Buffer(data);
	  console.log(buf.toString());
	});
	
	pg.stderr.on('data', function (data) {
	  console.log('stderr: ');
	  var buf = new Buffer(data);
	  console.log(buf.toString());
	});
	
	pg.on('close', function (code) {
	    console.log('phonegap build process exited with code ' + code);
		process.chdir(path.normalize('../..'));	
		console.log('Script now running from '+process.cwd());
		if (callback) callback(null);
	});

};

// =================== SEND APK EMAIL ================= //
var sendMail = function(callback) {
	// Create a SMTP transport object
	var transport = nodemailer.createTransport("SMTP", {
		auth : {
			user : "dinosorehealth@gmail.com",
			pass : "2bearsbakery"
		}
	});

	// Message object
	var message = {
		from : 'Dinosore <jason@dinoso.re>',
		to : '"Jason Schapiro" <yono38@gmail.com>,"Rebecca Hillegass" <rebecca.hillegass@gmail.com>',
		subject : 'Phonegap build', //
		text : 'Built at ' + (new Date().toLocaleDateString()) + '. Can also download at https://build.phonegap.com/apps/541789/builds',
		attachments : [{
			filePath : "app.apk"
		}]
	};
	// send the email with the app attached
	transport.sendMail(message, function(error) {
		if (error) {
			console.log('Error occurred');
			callback(error.message);
		}
		console.log('Message sent successfully!');
		// close the connection pool
		transport.close();
		if (callback) callback(null);
	});
};

// =================== DOWNLOAD NEW APK ================= //
var downloadApk = function(callback) {
	var options = {
		host : 'build.phonegap.com',
		path : '/api/v1/apps/541789/android',
		auth : 'yono38@gmail.com:d1n0s0re',
		port : 443
	};
	// phonegap only gives you the link to download off S3
	https.get(options, function(res) {
		var loc_str = "";
		res.on('data', function(chunk){
			var buf = new Buffer(chunk);
			loc_str += buf.toString();
		});
		res.on('end', function(){
			console.log('App location acquired from phonegap');
			var loc = JSON.parse(loc_str);
			if (!loc.location) {
				console.log('something went wrong');
				console.log(JSON.stringify(loc));
			} else {
				console.log('Downloading from '+loc.location);
				http.get(loc.location, function(res){
					console.log('Piping Data');
					var writeStream = fs.createWriteStream('app.apk');
					res.pipe(writeStream);
					console.log('file app.apk ready');
					console.log('Sending Mail');
					if (callback) callback(null);
				});
			}	
		});
	});
};
/* Possibly no longer needed
client.auth({
	token : 'wnANkqxtFzbqzQ6sMxyx'
}, function(e, api) {
	var options = {
		form : {
			data : {
				title : 'Dinosore',
				create_method : 'file'
			},
			file : 'my-app.zip'
		}
	};

	api.post('/apps/514031/build/android', options, function(e, data) {
		console.log('error:', e);
		console.log('data:', data);
		console.log("Build successful");
		sendMail();
	});
});
*/


/* ============= MAIN SCRIPT ========== */

async.waterfall([
    copySrcFiles,
    buildPhonegap,
    downloadApk,
    sendMail
], function (err, result) {
   console.log('Deploy script completed.')  ; 
});

