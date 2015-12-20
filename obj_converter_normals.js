/**
 * obj loader
 * node script that converts obj files to points and 
 * vertices which can be easily read by my 
 * Decartes line drawing library
 * 
 * Written by Seth Kranzler
 */

var fs = require('fs');

var filename = "daya_tris";


fs.readFile( __dirname + '/' + filename + '.obj', function (err, data) {
	if (err) {
		throw err; 
	}
	separateObjects(data);
});

/**
 * 
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function separateObjects(data){
	var lines = data.toString().split("\n");
	var objectMeshes = [];
	objectMeshes[0] = [];
	for(var max = lines.length, i = 0; i < max; i++){
		objectMeshes[0].push(lines[i].trim());
	}
	splitObjects(objectMeshes[0]);
}

/**
 * takes the object and parses the vertices and faces, turns faces into edges
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function splitObjects(data){
	var wireframe = {};
	wireframe.vertices = [];
	wireframe.edges = [];
	wireframe.normals = [];
	wireframe.tex = [];
	wireframe.output = [];
	var vCount = 0;
	var nCount = 0;
	var texCount = 0;
	for(var max = data.length, i = 0; i < max; i ++){
		if(data[i].substring(0,2) == "v "){
			var coords = data[i].split(" ");
			wireframe.vertices[vCount] = coords.slice(1,5);
			// wireframe.vertices[vCount].push(1);
			vCount ++;
		}
		if(data[i].substring(0, 3) == "vn "){
			var normalTemp = data[i].split(" ");
			wireframe.normals[nCount] = normalTemp.slice(1, 5);
			nCount ++;
		}
		if(data[i].substring(0, 3) == "vt "){
			var texTemp = data[i].split(" ");
			wireframe.tex[texCount] = texTemp.slice(1, 3);
			texCount ++;
		}
	}
	wireframe.vertices = normalizeVertices(wireframe.vertices);

	for(var max = data.length, i = 0; i < max; i ++){
		if(data[i].substring(0,2) == "f "){
			var faceTemp = data[i].split(" "); 
			// console.log(faceTemp);
			var face = [];
			for(var j = 1; j < faceTemp.length; j ++){
				var vInd = faceTemp[j].split("/")[0] - 1;
				var nInd = faceTemp[j].split("/")[2] - 1;
				var tInd = faceTemp[j].split("/")[1] - 1;

				for(var k = 0; k < 3; k ++){
					wireframe.output.push(wireframe.vertices[vInd][k]);
				}

				for(var k = 0; k < 3; k ++){
					wireframe.output.push(wireframe.normals[nInd][k]);
				}
				for(var k = 0; k < 2; k++){
					wireframe.output.push(wireframe.tex[tInd][k]);
				}
			}
		}
	}

	console.log(wireframe.vertices.length);
	console.log(wireframe.normals.length);
	console.log(wireframe.edges.length);

	fs.writeFile(filename + '.js', JSON.stringify(wireframe.output), function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
}

function normalizeVertices(verts){
	var lNum = 0;
	for (var iMax = verts.length, i = 0; i < iMax; i ++){
		for(var jMax = verts[i].length, j = 0; j < jMax; j ++){
			if(Math.abs(verts[i][j]) > lNum){
				lNum = verts[i][j];
			}
		}
	}
	for (var iMax = verts.length, i = 0; i < iMax; i ++){
		for(var jMax = verts[i].length, j = 0; j < jMax; j ++){
			verts[i][j] = verts[i][j]/lNum;
		}
	}
	// console.log(verts);
	return verts;
}