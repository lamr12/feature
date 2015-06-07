var express = require('express'),
	Q = require('q'),
	fs = require('fs'),
	path = require('path'),
    Mixer = require('../models/mixer');

var exports = module.exports = {};

var dirName = path.join(__dirname, '../');

var installPackages = function(packages) {
	var count,promises;

	count = Object.keys(packages).length;
	promises = [];

	if(count >= 1) {

		Object.keys(packages).forEach(function (val,index) {
			if(packages[val] !== '') {
				var file, lastVersion, deferred = Q.defer();

				lastVersion = false;
				file = val + "#" + packages[val];

				Mixer.searchPackage(file)
		 		.then(function (data) {
	 			if(data.exist === false) {
	 				Mixer.installPackage(file, lastVersion)
	 					.then(function (data) {
	 						Mixer.listPackage()
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
				var last, lastVersion ,deferred = Q.defer();

				lastVersion = true;
				last = val + "#last";
				
	 			Mixer.searchPackage(last)
			 		.then(function (data) {
		 			if(data.exist === false) {
		 				Mixer.installPackage(val,lastVersion)
		 					.then(function (data) {
		 						Mixer.listPackage()
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

var compileData = function (res, data, ext, minify){
	ext = ext || 'js';
	minify = minify || false;
	if(data.length > 1) {
		data = Mixer.verifyMain(data, ext)
		var file = Mixer.concat(data);
		fs.writeFileSync('compile.'+ext, file);
		if (minify) {
			var result = Mixer.minify('compile.'+ext, ext);
			fs.writeFileSync('compile.min.'+ext, result.styles);
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
				var result = Mixer.minify('compile.'+ext, ext);
				fs.writeFileSync('compile.min.'+ext, result.styles);
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
		var resp = {};

		resp.code = 400;
		resp.msg = 'Not supplied parameters';
		resp.content = {'content-type' : 'text/plain'};
		
		 res.writeHead(resp.code, resp.msg, resp.content);
		 res.end(resp.msg);
	}else {
		var promise = installPackages(req.query);
		var files = Object.keys(req.query);

		promise.then(function(d) {
			var p;

			console.log("Search files for concat");
			console.log(req.query);
			p = Mixer.searchPackageInstalled(req.query);

			p.then(function(data) {
				compileData(res, data, ext, minify);
			});
		}, function(err) {
			var code = 404;
			var msg = err.msg + " file:" + err.file
			
			res.writeHead(code, msg, {'content-type' : 'text/plain'});
			res.end(msg);
		})
	}
}

exports.test = function() {
	console.log(path.join(dirName, '../'));
	Mixer.test();
}


