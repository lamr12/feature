var express = require('express'),
	Q = require('q'),
	fs = require('fs'),
	path = require('path'),
	Helper = require('../helper/helper'),
    Mixer = require('../models/mixer'),
    CB = require('../models/custom/custom-build.js');

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

	CB.customBuild(f,obj)
		.then(function (filePath) {
			resolve.path = filePath;
			deferred.resolve(resolve);
		}, function(err){
			deferred.reject(err);
		})
	
	return deferred.promise;
}



var installPackages = function(packages) {
	var count,promises,deferred = Q.defer();

	count = Object.keys(packages).length;
	promises = [];

	if(count >= 1) {

		Object.keys(packages).forEach(function (val,index) {


			if(packages[val] !== '') {
				if(Helper.isJsonString(packages[val])){
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
				}else {
					deferred.reject(Mixer.manageErrors("ENOTFOUND"));
					promises.push(deferred.promise);
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
		data = Mixer.verifyMain(data, ext);
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
		var file,p;
		data = Mixer.verifyMain(data, ext);
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
	if(Helper.isEmptyJSON(req.query)) {
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
			var msg;
			
			if(err.file !== "" && err.extra === ""){
				msg = msg = err.msg + " file:" + err.file;
			}else if(err.extra !== "" && err.file === "") {
				msg = msg = err.msg + " extra:" + err.extra;
			}else {
				msg = msg = err.msg + " file:" + err.file + " extra:" + err.extra;
			}
			 
			res.writeHead(err.code, msg, {'content-type' : 'text/plain'});
			res.end(JSON.stringify(err));
			
		})
	}
}

exports.test = function(req) {
	console.log(Mixer.duplicateQuery(req.query));
}



