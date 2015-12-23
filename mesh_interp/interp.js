var fs = require("fs");

var daya = [];
fs.readFile( __dirname + '/' + 'daya_eye_c4d_' + '.js', function (err, data) {
	if (err) {
		throw err; 
	}
	daya[0] = JSON.parse(data);
	fs.readFile( __dirname + '/' + 'daya_sing_' + '.js', function (err, data) {
		if (err) {
			throw err; 
		}
		daya[29] = JSON.parse(data);
		interpVerts();
	});
});

function interpVerts(){
	for(var i = 1; i < 29; i ++){
		for(var j = 0; j < )
	}
}