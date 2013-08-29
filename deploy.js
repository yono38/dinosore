// TODO
// - scp to jasonschapiro.com
// - zip build file
// - git commit / push to github
var fs = require('fs');
var nodemailer = require('nodemailer');
var client = require('phonegap-build-api');

var sendMail = function() {
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

				/********* AUTHORIZE WITH PHONEGAP ***************/
				client.auth({ token: 'wnANkqxtFzbqzQ6sMxyx' }, function(e, api) {
						var writeStream = fs.createWriteStream('app.apk');
						/********* DOWNLOAD THE APP ***************/
						var get = (api.get('/apps/514031/android'));
						get.pipe(writeStream);
						get.on('end', function(){
							console.log('file app.apk ready');
								console.log('Sending Mail');
								/********* ALERT THE TEAM ***************/
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


client.auth({ token: 'wnANkqxtFzbqzQ6sMxyx' }, function(e, api) {
  var options = {
    form: {
        data: {
            title: 'Dinosore',
            create_method: 'file'
        },
        file: 'my-app.zip'
    }
  };

  api.post('/apps/514031/build/android', options, function(e, data) {
    console.log('error:', e);
    console.log('data:', data);
	  console.log("Build successful");
		sendMail();
  });
});
