var express = require('express'),
	Q = require('q'),
	fs = require('fs'),
	path = require('path'),
    Mixer = require('../models/mixer');

var exports = module.exports = {};

var dirName = path.join(__dirname, '../');

var installWithVersion = function(f,version) {
	var resolve = {}, fileName, lastVersion, deferred = Q.defer();

	lastVersion = false;
	fileName = f  + "#" + version;
	resolve.success = true;
	resolve.custom = false;  

	Mixer.searchPackage(fileName)
		.then(function (data) {
			if(data.exist === false) {
				Mixer.installPackage(fileName, lastVersion)
 					.then(function (data) {
 						deferred.resolve(resolve);
 					},function(err) {
 						deferred.reject(err);
 					});
			}else if(data.exist === true) {
	 			deferred.resolve(resolve);			
 			}
		}, function(err) {
			deferred.reject(err);
		})

	return deferred.promise;
}

var installLast = function(f) {
	var resolve = {}, fileName, lastVersion, deferred = Q.defer();

	lastVersion = true;
	fileName = f + "#last";
	resolve.success = true;
	resolve.custom = false; 

	Mixer.searchPackage(fileName)
 		.then(function (data) {
 			if(data.exist === false) {
 				Mixer.installPackage(f,lastVersion)
 					.then(function (data) {
						deferred.resolve(resolve);
 					}, function(err) {
 						deferred.reject(err);
 					});
 			}else if(data.exist === true) {
 				deferred.resolve(resolve);
 			}
 		}, function(err) {
 			deferred.reject(err);
 		}); 

	return deferred.promise;
}

var installCustom = function(f,obj) {
	var resolve = {}, fileName, lastVersion, deferred = Q.defer();

	resolve.success = true;
	resolve.custom = true; 


	Mixer.customBuild(f,obj)
		.then(function (filePath) {
			resolve.path = filePath;
			deferred.resolve(resolve);
		}, function(err){
			deferred.reject(err);
		})
	
	//deferred.reject(Mixer.manageErrors("EMPTY"));

	return deferred.promise;
}

var installPackages = function(packages) {
	var count,promises;

	count = Object.keys(packages).length;
	promises = [];

	if(count >= 1) {

		Object.keys(packages).forEach(function (val,index) {
			if(packages[val] !== '') {

				if(typeof JSON.parse(packages[val]) === 'number') {
					var p;
					p = installWithVersion(val,packages[val]);
			 		promises.push(p);
				}

				if(typeof JSON.parse(packages[val]) === 'object') {
					var p;
					p = installCustom(val, JSON.parse(packages[val]));
					promises.push(p);
				}

			} else {
				var p; 

				p = installLast(val);
		 		promises.push(p);
			}	
		});
		
	 	return Q.all(promises);
	}
}

var compileData = function (res, data, ext, minify){
	ext = ext || 'js';
	minify = minify || false;
	if(data.length > 1) {
		console.log(data);
		data = Mixer.verifyMain(data, ext)
		var file = Mixer.concat(data);
		fs.writeFileSync('compile.'+ext, file);
		if (minify) {
			var result = Mixer.minify(dirName + '/compile.'+ext, ext);
			fs.writeFileSync('compile.min.'+ext, result.code);
			res.sendFile(dirName + '/compile.min.'+ext);
		} else{
			res.sendFile(dirName + '/compile.'+ext);
		};
	}else if(data.length === 1) {
		console.log(data);

		var file,p;
		data = Mixer.verifyMain(data, ext);
		console.log(data)
		file = dirName + data[0].path;
		p = Mixer.getFile(file);
		p.then(function(f) {
			fs.writeFileSync('compile.'+ext, f);
			
			if (minify) {
				var result = Mixer.minify(dirName + '/compile.'+ext, ext);
				fs.writeFileSync('compile.min.'+ext, result.code);
				res.sendFile(dirName + '/compile.min.'+ext);
			} else{
				res.sendFile(dirName + '/compile.'+ext);
			};
		});
	}
};

exports.compile = function(req,res,ext,minify) {
	ext = ext || 'js';
	minify = minify || false;
	if(Mixer.isEmptyJSON(req.query)) {
		var resp = Mixer.manageErrors("EMPTY");
		
		res.writeHead(resp.code, resp.msg, {'content-type' : 'text/plain'});
		res.end(JSON.stringify(resp));

	}else if(Mixer.duplicateQuery(req.query) || Mixer.duplicateQueryInURL(req)) {
		var resp = Mixer.manageErrors("DUPLICATED");
		
		res.writeHead(resp.code, resp.msg, {'content-type' : 'text/plain'});
		res.end(JSON.stringify(resp));

	}else {
		//--- add method for custom build
		var promise = installPackages(req.query);
		var files = Object.keys(req.query);

		promise.then(function(data) {
			var p;

			// if(data.custom) {

				

			// }else {
				console.log("Search files for concat");
				console.log(req.query);
				p = Mixer.searchPackageInstalled(req.query);

				p.then(function(data) {
					console.log(data);
					console.log("Compile data..");
					compileData(res, data, ext, minify);
				});
			// }
		}, function(err) {
			var msg = err.msg + " file:" + err.file
			 
			res.writeHead(err.code, msg, {'content-type' : 'text/plain'});
			res.end(JSON.stringify(err));
		})
	}
}

exports.test = function(req) {
	console.log(Mixer.duplicateQuery(req.query));
}



