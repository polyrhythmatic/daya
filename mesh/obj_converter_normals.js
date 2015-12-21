/**
 * obj loader
 * node script that converts obj files to points and 
 * vertices which can be easily read by my 
 * Decartes line drawing library
 * 
 * Written by Seth Kranzler
 */

var math = require("mathjs")

var fs = require("fs");

var filename = "daya_quad";


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

var outputArray = [];
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
			var faceTemp = faceTemp.slice(1, faceTemp.length);
			for(var j = 0; j < faceTemp.length - 1; j ++){

				var p1 = {pos : [], normals : [], tex : []};
				var p2 = {pos : [], normals : [], tex : []};

				var vInd1 = faceTemp[j].split("/")[0] - 1;
				var nInd1 = faceTemp[j].split("/")[2] - 1;
				var tInd1 = faceTemp[j].split("/")[1] - 1;

				var vInd2 = faceTemp[j + 1].split("/")[0] - 1;
				var nInd2 = faceTemp[j + 1].split("/")[2] - 1;
				var tInd2 = faceTemp[j + 1].split("/")[1] - 1;

				for(var k = 0; k < 3; k ++){
					p1.pos.push(parseFloat(wireframe.vertices[vInd1][k]));
					p2.pos.push(parseFloat(wireframe.vertices[vInd2][k]));
				}

				for(var k = 0; k < 3; k ++){
					p1.normals.push(parseFloat(wireframe.normals[nInd1][k]));
					p2.normals.push(parseFloat(wireframe.normals[nInd2][k]));
				}
				for(var k = 0; k < 2; k++){
					p1.tex.push(parseFloat(wireframe.tex[tInd1][k]));
					p2.tex.push(parseFloat(wireframe.tex[tInd2][k]));
				}
				createTriStrip(p1, p2);
			}
		}
	}
	console.log(outputArray.length);

	fs.writeFile("../" + filename + '.js', "var daya = " + JSON.stringify(outputArray), function (err) {
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
			verts[i][j] = verts[i][j]/(0.5*lNum);
		}
	}
	// console.log(verts);
	return verts;
}


/**
 * returns a triangle strip between the two points
 * @param  {[type]} p1 [description]
 * @param  {[type]} p2 [description]
 * @return {[type]}    [description]
 */

//p1 and p2 are objects
//they have position attributes (len 3 arrays)
//they have normal attribute for that pos (len 3 arrays)
//they have tex coords (len 2 arrays)

var offsetDist = 0.005;
function createTriStrip(p1, p2){
	var vDir1 = math.divide(math.subtract(p2.pos, p1.pos), math.norm(math.subtract(p2.pos, p1.pos),3));
	var vDir2 = math.multiply(vDir1, -1);
	var nDir1 = p1.normals;
	var nDir2 = p2.normals;

	//eDir is the offset direction for the smaller leg 
	//for each offset triangle
	var eDir1 = math.cross(nDir1, vDir1);
	var eDir2 = math.cross(nDir2, vDir2);

	var p1_1 = math.add(p1.pos, math.multiply(offsetDist, eDir1));
	var p1_2 = math.add(p1.pos, math.multiply(-offsetDist, eDir1));
	var p2_1 = math.add(p2.pos, math.multiply(offsetDist, eDir2));
	var p2_2 = math.add(p2.pos, math.multiply(-offsetDist, eDir2));

	// console.log(p1_1);
	// console.log(p1_2);
	// console.log(p2_1);
	// console.log(p2_2);

	//push each triangle to the output array 
	//in the order of position, normals, texture
	//for now I am assuming p1 tex and norms for p1_1 and p1_2 etc
	//since offsetDist will be so small
	//TRIANGLE ONE
	//FROM p1_1 TO p1_2 TO p2_1
	outputArray.extend(p1_1);
	outputArray.extend(p1.normals);
	outputArray.extend(p1.tex);

	outputArray.extend(p1_2);
	outputArray.extend(p1.normals);
	outputArray.extend(p1.tex);

	outputArray.extend(p2_1);
	outputArray.extend(p2.normals);
	outputArray.extend(p2.tex);

	//TRIANGLE TWO
	//FROM p1_2 TO p2_1 TO p2_2
	outputArray.extend(p1_2);
	outputArray.extend(p1.normals);
	outputArray.extend(p1.tex);

	outputArray.extend(p2_1);
	outputArray.extend(p2.normals);
	outputArray.extend(p2.tex);

	outputArray.extend(p2_2);
	outputArray.extend(p2.normals);
	outputArray.extend(p2.tex);

}

//taken from http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array/17368101#17368101
Array.prototype.extend = function (other_array) {
	/* you should include a test to check whether other_array really is an array */
	other_array.forEach(function(v) {this.push(v)}, this);    
}