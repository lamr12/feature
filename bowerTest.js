var bower = require('bower');
var Q = require('q');
var shell = require('shelljs');
var uglifyJS = require("uglify-js");
var fs = require('fs');

var exports = module.exports = {};

function isEmptyJSON(obj) {
	var name;

 	for(name in obj) {
 		return false; 
 	}

  	return true;
}


exports.installPackage = function(fileName,lastVersion) {
	var deferred = Q.defer();
	console.log("Initiating installation process");

	bower.commands
		.install([fileName], { save: true }, {})
		.on('end', function (result) {
			var rename, name;
			console.log("Installing Packages... " + fileName);
			rename = fileName + "#last";
			name = fileName;
			name = name.replace(/[\d\#.]+/g, "");

			if(lastVersion) {
				fs.rename('bower_components/'+name,'bower_components/'+rename);
			}else {
				fs.rename('bower_components/'+name,'bower_components/'+fileName);
			}

			deferred.resolve(true);
		})
		.on('error', function (err) {

			if(err.code === "ECONFLICT") {
				deferred.reject({"msg":"Conflict error.", "file":fileName});
			}

			if (err.code === "ENOTFOUND" || err.code === "ENORESTARGET") {
				deferred.reject({"msg":"File not found.", "file":fileName}); 		
 			}

 			if (err.code === "ENORESTARGET") {
 				deferred.reject({"msg":"File version wrong.", "file":fileName});
 			}
		})

	return deferred.promise;
};

exports.listPackage = function() {
	var deferred = Q.defer();

	bower.commands
		.list({paths:true})
		.on('end', function (data) {
			deferred.resolve(data);
		})
		.on('error', function (err) {
			console.log("Error packages listing...");
			deferred.reject(err);
		})

	return deferred.promise;
};

exports.searchPackage = function(name) {
	var deferred = Q.defer();

	bower.commands
		.list({paths:true})
		.on('end', function (data) {
			var exist = {};
			console.log("looking packages...");
			if(Object.keys(data).length > 0) {
				exist.exist = false;
				Object.keys(data).forEach(function(p) {
					if(name === p) {
						exist.exist = true 	
					} 
				});
				deferred.resolve(exist);
			}else {
				exist.exist = false;
				deferred.resolve(exist);
			} 
		})
		.on('error', function (err) {
			console.log(err)
			deferred.reject("error");
		})

	return deferred.promise;
};

exports.searchPackageInstalled = function(packages) {
	var deferred = Q.defer();
	var rObj = [];

	Object.keys(packages).forEach(function (val,index) {

		if(packages[val] !== '') {
			var file;

			file = val + "#" + packages[val];

			bower.commands
				.list({paths:true})
				.on('end', function (data) {
					if(Object.keys(data).length > 0) {
						Object.keys(data).forEach(function(p) {
							if(p === file) {
								rObj.push
									(
										{
											'exist':true,
											'name':file,
											'path':data[p]
										}
									)
							}
						});
					}
				});

		}else {
			var file,folderName;

			file = val;
			folderName = val + "#last";

			bower.commands
				.list({paths:true})
				.on('end', function (data) {
					if(Object.keys(data).length > 0) {
						Object.keys(data).forEach(function(p) {
							if(p === folderName) {
								rObj.push
									(
										{
											'exist':true,
											'name':file,
											'path':data[p]
										}
									)
							}
						});
					}
				});

		}
	});

	setTimeout( function() {
        deferred.resolve(rObj);
    }, 2000);

	return deferred.promise;
};

exports.minify = function(file) {
	var result;

	console.log("minify ...");

	result = uglifyJS.minify(file, {
		mangle: true,
		compress: {
			sequences: true,
			dead_code: true,
			conditionals: true,
			booleans: true,
			unused: true,
			if_return: true,
			join_vars: true,
			drop_console: true
		}
	});

	return result;
}

exports.concat = function(f) {
	var files = [];

	console.log("concatenating...")
	f.forEach(function(val) {
		files.push(val.path);
	})

	console.log(files);

	return shell.cat(files);
}

exports.getFile = function(filePath) {
	var deferred = Q.defer();

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data) {
	    if (!err) {
	    	deferred.resolve(data);
	    }else{
	        console.log(err);
	        deferred.reject("error");
	    }
	});

	return  deferred.promise;
}

exports.verifyMain = function(path) {
	path.forEach(function (val) {
		var name, n;

		name = val.name.replace(/[\d\#.]+/g, "");

		n = val.path.search(name+".js");

		if(n !== -1) {
		}else {

			val.path = val.path + "/" + name+".js";
		}
	});

	return path; 
}



