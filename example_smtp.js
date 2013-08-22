// TODO
// - scp to jasonschapiro.com
// - zip build file
// - git commit / push to github
var fs = require('fs');
var nodemailer = require('nodemailer');
var client = require('phonegap-build-api');

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
    text: 'URL GOES HERE!',
		attachments: [
			{
				filePath: "app.apk"
			}
		]
    
};

var options = {
    form: {
        data: {
            debug: false
        },
        file: '/path/to/app.zip'
    }
};


client.auth({ token: 'wnANkqxtFzbqzQ6sMxyx' }, function(e, api) {
    // time to make requests
		var writeStream = fs.createWriteStream('app.apk');
	  var get = (api.get('/apps/514031/android'));
		get.pipe(writeStream);
		get.on('end', function(){
			console.log('file app.apk ready');
				console.log('Sending Mail');
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
		console.log('test - should come first');
});

