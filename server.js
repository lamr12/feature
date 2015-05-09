var express = require('express');
var apiBower = require('./bowerTest.js');
var Q = require('q');
var app = express(); 
var fs = require('fs');

/* example route to manage 
	http://127.0.0.1:3000/compile.js?jquery&underscore&angular&amplify
	http://127.0.0.1:3000/compile.js?jquery=1.6&underscore=2.0&angular=last&amplify=last
*/


var installPackages = function(packages) {
	var count,
		promises;

	console.log(packages);
	count = Object.keys(packages).length;
	promises = [];

	if(count >= 1) {
		Object.keys(packages).forEach(function (val,index) {
		var deferred = Q.defer();
 			apiBower.searchPackage(val)
		 		.then(function (data) {
	 			if(!data) {
	 				apiBower.installPackage(val)
	 					.then(function (data) {
	 						apiBower.listPackage()
	 							.then(function (data) {
	 								deferred.resolve(data);
	 							})
	 					})
	 			}
	 		})
		 	promises.push(deferred.promise);
	 	});

	 	return Q.all(promises);
	}
}

app.get('/', function(req, res) {
	res.end("Mixer.js");   
});
	
app.get('/compile.js', function(req, res) {
	
	var promise = installPackages(req.query);
	promise.then(function(data) {
		var paths;
		paths = [];
		console.log(data);

		Object.keys(data[0]).forEach(function (val,index) {
			paths.push(data[0][val]);
		});

		if(paths.length > 1) {
			console.log(paths);
			var file = apiBower.concat(paths);
			fs.writeFileSync('compile.js', file);
			res.sendFile(__dirname + '/compile.js');
		}else if(paths.length === 1) {
			console.log(paths);
			var file = __dirname + '/' + paths[0];
			fs.writeFileSync('compile.js', file);
			res.sendFile(__dirname + '/compile.js');
		}
		
	})
});

app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
