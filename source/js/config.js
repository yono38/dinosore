// =========================
// PARSE.COM
// TODO PHASE OUT
// =========================
Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

// ==========================
// ENVIRONMENT
// ==========================
$dino.env = 'dev';
//$dino.env = 'prod';
//$dino.env = 'cache';

// ==========================
// SET API ROOT
// ==========================
var setApiPath = function() {
	var apiEnv = $dino.env
	, apiPath = '/api/v1';
	if (apiEnv == 'dev') $dino.apiRoot = 'http://localhost:3000' + apiPath;
	else if (apiEnv == 'prod') $dino.apiRoot = 'http://jasonschapiro.com:3000' + apiPath;
	else $dino.apiRoot = '';
	console.log('Set up API root "'+$dino.apiRoot+'" for environment '+apiEnv);
}();
// =========================
// SET UP OFFLINE STATUS
// =========================
// Defaults to online
$dino.offline = false;

// Always listening for changes
// TODO need to see if this works in phonegap
$(window).on("offline", function(){
	$dino.offline = true;
});
$(window).on("online", function(){
	$dino.offline = false;
});

// Function to ping and see if web server running
var ping = function(){
	$.ajax({
		url: 'http://jasonschapiro.com',
		success: function(d){
			$dino.offline = false;
		},
		error: function(){
			$dino.offline = true;
		}
	});
};	
// determine initial state
ping();
