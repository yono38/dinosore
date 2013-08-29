// TODO
// - scp to jasonschapiro.com
// - zip build file
// - git commit / push to github
var fs = require('fs');
var nodemailer = require('nodemailer');
var client = require('phonegap-build-api');
var sys = require('sys')
var zip = require('adm-zip');

// copy files into phonegap folder
var exec = require('child_process').exec;
var child = exec("cp -u -v -r source/. my-app/www/ >> logs/build_"+(new Date().getTime())+'.txt', function (error, stdout, stderr) {
	console.log("Files copied - log saved to logs/build_"+(new Date().getTime())+'.txt');
	
});


/********* BUILD THE APP ***************/
function buildApp(){
// download the app from phonegap build
client.auth({ token: 'wnANkqxtFzbqzQ6sMxyx' }, function(e, api) {
zip.addLocalFolder('my-app/');
zip.writeZip('my-app.zip', function(

});
}

/********* ALERT THE TEAM ************/
function sendMail(){
// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
        //service: 'Gmail', // use well known service.
                            // If you are using @gmail.com address, then you don't
                            // even have to define the service name
        auth: {
            user: "dinosorehealth@gmail.com",
            pass: "2bearsbakery"
        }
    });

console.log('SMTP Configured');

// Message object
var message = {
    // sender info
    from: 'Dinosore <jason@dinoso.re>',
    // Comma separated list of recipients
    to: '"Jason Schapiro" <yono38@gmail.com>,"Rebecca Hillegass" <rebecca.hillegass@gmail.com>',
    // Subject of the message
    subject: 'Phonegap build', //
    // plaintext body
    text: 'Built at '+(new Date().getTime()),
	attachments: [
		{
			filePath: "app.apk"
		}
	]
};

// download the app from phonegap build
client.auth({ token: 'wnANkqxtFzbqzQ6sMxyx' }, function(e, api) {
	  var writeStream = fs.createWriteStream('app.apk');
	  var get = (api.get('/apps/514031/android'));
		get.pipe(writeStream);
		get.on('end', function(){
			console.log('file app.apk ready');
				console.log('Sending Mail');
				// send the email with the app attached
				transport.sendMail(message, function(error){
						if(error){
								console.log('Error occured');
								console.log(error.message);
								return;
						}
						console.log('Message sent successfully!');
						transport.close(); // close the connection pool
						return;
				});
		});
});
}
