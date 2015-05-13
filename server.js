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
	var count,promises;

	count = Object.keys(packages).length;
	promises = [];

	if(count >= 1) {

		console.log(packages[Object.keys(packages)]);

		Object.keys(packages).forEach(function (val,index) {

			if(packages[val] !== '') {
				var deferred = Q.defer();
				var file = val + "#" + packages[Object.keys(packages)];
				apiBower.searchPackage(file)
		 		.then(function (data) {
		 		console.log("busqueda de paquete...");
		 		console.log(data);	
	 			if(!data) {
		 				apiBower.installPackage(file)
		 					.then(function (data) {
		 						console.log(data);

		 						apiBower.listPackage()
		 							.then(function (data) {
		 								deferred.resolve(apiBower.verifyMain(val,data));
		 							})
		 					}, function(err) {
		 						deferred.reject(err);
		 					})
		 			}
		 		}, function(err) {

		 		});
			 	promises.push(deferred.promise);

			} else {
				Object.keys(packages).forEach(function (val,index) {
				var deferred = Q.defer();
		 			apiBower.searchPackage(val)
				 		.then(function (data) {
			 			if(!data) {
			 				apiBower.installPackage(val)
			 					.then(function (data) {
			 						apiBower.listPackage()
			 							.then(function (data) {
			 								deferred.resolve(apiBower.verifyMain(val,data));
			 							})
			 					})
			 			}
			 		})
				 	promises.push(deferred.promise);
			 	});
			}	
		});
		
	 	return Q.all(promises);
	}
}

app.get('/', function(req, res) {
	res.end("Mixer.js");
});
	
app.get('/compile.js', function(req, res) {

	var promise = installPackages(req.query);
	console.log("trabaa");
	var files = Object.keys(req.query);
	var toConcat;

	promise.then(function(data) {
		var paths;
		paths = [];

		files.forEach(function (e) {
			toConcat = data.filter(function (elm) {
				console.log(Object.keys(elm)[0]);
				return (Object.keys(elm)[0] === e);
			})
		});

		console.log(toConcat);

		if(paths.length > 1) {
			console.log(paths);
			var file = apiBower.concat(paths);
			fs.writeFileSync('compile.js', file);
			res.sendFile(__dirname + '/compile.js');
		}else if(paths.length === 1) {
			var file,p;
			file = __dirname + '/' + paths[0];
			p = apiBower.getFile(file);
			p.then(function(data) {
				fs.writeFileSync('compile.js', data);
				//res.sendStatus(404);
				res.sendFile(__dirname + '/compile.js');
			});
		}
		
	}, function(err) {
		res.end(err);
	})
});

app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
