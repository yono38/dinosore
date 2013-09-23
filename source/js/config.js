// CONFIG STUFF
Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");
//$dino.env = 'dev';
$dino.env = 'prod';

$dino.apiRoot = (($dino.env == 'dev') ? '' : 'http://jasonschapiro.com:3000') + '/api/v1';
console.log($dino.apiRoot);