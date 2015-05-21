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

		Object.keys(packages).forEach(function (val,index) {

			if(packages[val] !== '') {
				var deferred = Q.defer();
				var file = val + "#" + packages[val];
				apiBower.searchPackage(file)
		 		.then(function (data) {
	 			if(data.exist === false) {
	 				apiBower.installPackage(file)
	 					.then(function (data) {
	 						apiBower.listPackage()
	 							.then(function (data) {
	 								deferred.resolve(true);
	 							}, function(err) {
	 								deferred.reject(err);
	 							})
	 					}, function(err) {
	 						deferred.reject(err);
	 					})
	 			}else if(data.exist === true) {
		 			deferred.resolve(true);			
	 			}
		 		}, function(err) {
		 			deferred.reject(err);
		 		});
			 	promises.push(deferred.promise);

			} else {
				var deferred = Q.defer();
		 			apiBower.searchPackage(val)
				 		.then(function (data) {
			 			if(data.exist === false) {
			 				apiBower.installPackage(val)
			 					.then(function (data) {
			 						apiBower.listPackage()
			 							.then(function (data) {
			 							deferred.resolve(true);
			 							}, function (err) {
			 							deferred.reject(err);
			 							})
			 					}, function(err) {
			 						deferred.reject(err);
			 					})
			 			}else if(data.exist === true) {
			 				deferred.resolve(true);
			 			}
			 		}, function(err) {
			 			deferred.reject(err);
			 		});

				 	promises.push(deferred.promise);
			}	
		});
		
	 	return Q.all(promises);
	}
}

var listPackagesInstalled = function(files) {
	var promises,rObj;

	promises = [];

	files.forEach(function (e) {
		var deferred = Q.defer();
		var p = apiBower.searchPackage(e);

		p.then(function(data) {
			rObj[e] = data.path;
			deferred.resolve(rObj);
		});

		promises.push(deferred.promise);
	});
	
	return Q.all(promises);
}

app.get('/', function(req, res) {
	apiBower.initBower().then(function(data) {
		console.log(data);
	}, function(err) {
		console.log(err);
	})

	res.end("Mixer.js");
});
	
app.get('/compile.js', function(req, res) {

	var promise = installPackages(req.query);
	var files = Object.keys(req.query);

	promise.then(function(d) {
		var p;

		console.log("Search files for concat");
		p = apiBower.searchPackageInstalled(files);

		p.then(function(data) {
			if(data.length > 1) {
				data = apiBower.verifyMain(data)
				var file = apiBower.concat(data);
				fs.writeFileSync('compile.js', file);
				res.sendFile(__dirname + '/compile.js');
			}else if(data.length === 1) {
				var file,p;
				data = apiBower.verifyMain(data);
				file = __dirname + '/' + data[0].path;
				p = apiBower.getFile(file);
				p.then(function(f) {
					fs.writeFileSync('compile.js', f);
					
					res.sendFile(__dirname + '/compile.js');
				});
			}

		});
	}, function(err) {
		res.status(404).send(err);
	})
});

app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
