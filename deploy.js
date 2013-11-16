// TODO
// run jasmine tests on dev mongo db

// - scp to jasonschapiro.com (will put in remote deploy script)
// - adm-zip build file
// usse phonegap-build-api to build app
// XX git commit / push to github (should be in build script, not deploy script)

// =================== IMPORT LIBRARIES ================= //
var fs = require('fs-extra')
, nodemailer = require('nodemailer')
, client = require('phonegap-build-api')
, phonegap = require('phonegap')
, async = require('async')
, path = require('path')
, spawn = require('child_process');

// ============== MOVE LATEST SOURCE TO PHONEGAP ============ //
// TODO use git diff to determine exactly which files to move
var copySrcFiles = function(cb){
	console.log('copying newest source files over to phonegap/www folder..');
	console.log('Note: Doesn\'t copy over main.js or config.js by default');
	var copyDirs = ['js/main.js', 'index.html', 'css', 'img', 'lib', 'js/Models', 'js/Views'];
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

// ============== CONCAT TEMPLATES ============ //
var concatTpl = function(callback){
	var fs = require('fs');
	
	console.log('Concatinating templates for production..');
	var tplDir= path.normalize('./source/tpl/'),
	    resultFileName = path.normalize('./build/phonegap/www/templates.html');
	try {
		var final = fs.removeSync(resultFileName);
	} catch (err){
		console.log(err);
	}
	var tpls = fs.readdirSync(tplDir);
	
	console.log(tpls);
	tpls.forEach(function(tpl, idx, arr) {
		// remove .html from name
		var tplName = path.basename(tpl, '.html');
		fs.appendFileSync(resultFileName, '<!---- ============== '+tplName+' ============== ---->\n<script type="template" id="'+tplName+'">\n');
		var tplFileContents = fs.readFileSync(tplDir+tpl, {encoding: 'utf8'});
		fs.appendFileSync(resultFileName, tplFileContents);
		fs.appendFileSync(resultFileName, '</script>\n\n');
	});
	console.log('Templates succesfully concatinated');
	if (callback) callback(null);
};
// ================== BUILD WITH PHONEGAP ============ //
function buildPhonegap(callback){
	console.log('building phonegap app for android');
	var normDir = path.normalize('build/phonegap');
	console.log('Changing directory to ' + process.cwd() + normDir);
	process.chdir(normDir);
	var spawn = require('child_process').spawn,
     pg = spawn('cmd', ['/c', 'phonegap run android']);

	pg.stdout.on('data', function (data) {
	  console.log(data);
	});
	
	pg.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
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
		text : 'Built at ' + (new Date().getTime()),
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

var downloadApk = function(callback) {
	// Authorize with Phonegap
	client.auth({
		token : 'wnANkqxtFzbqzQ6sMxyx'
	}, function(e, api) {
		var writeStream = fs.createWriteStream('app.apk');
		/********* DOWNLOAD THE APP ***************/
		var get = (api.get('/apps/514031/android'));
		get.pipe(writeStream);
		get.on('end', function() {
			console.log('file app.apk ready');
			console.log('Sending Mail');
			if (callback) callback(null);
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
    concatTpl,
    buildPhonegap,
    downloadApk,
    sendMail
], function (err, result) {
   console.log('Deploy script completed.')  ; 
});

