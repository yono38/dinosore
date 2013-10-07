var fs = require('fs')
,	sys = require('sys');

console.log(process.cwd());
var tplDir= '../source/tpl/',
    resultFileName = 'phonegap/www/templates.html';
try {
	var final = fs.unlinkSync(resultFileName);
} catch (err){
	console.log(err);
}
var tpls = fs.readdirSync(tplDir);

console.log(tpls);
tpls.forEach(function(tpl, idx, arr) {
	// remove .html from name
	var tplName = tpl.substring(0, tpl.length - 5);
	fs.appendFileSync(resultFileName, '<!---- ============== '+tplName+' ============== ---->\n<script type="template" id="'+tplName+'">\n');
	var tplFileContents = fs.readFileSync(tplDir+tpl, {encoding: 'utf8'});
	fs.appendFileSync(resultFileName, tplFileContents);
	fs.appendFileSync(resultFileName, '</script>\n\n');
});
