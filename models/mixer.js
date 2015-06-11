var bower = require('bower');
var Q = require('q');
var shell = require('shelljs');
var uglifyJS = require("uglify-js");
var uglifyCSS = require("uglifycss");
var fs = require('fs');
var replace = require('replace');
var CleanCss = require('clean-css');

var exports = module.exports = {};

exports.isEmptyJSON = function(obj) {
	var name;

 	for(name in obj) {
 		return false; 
 	}

  	return true;
};


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

			if(fileName == 'bootstrap' && lastVersion){
				replace({
				    regex: "../fonts/",
				    replacement: "bower_components/bootstrap#last/dist/fonts/",
				    paths: ['bower_components/bootstrap/dist/css/bootstrap.css'],
				    recursive: true,
				    silent: true,
				});
			}

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
		});

	

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

exports.test = function() {
	console.log("test main");
}

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
			console.log("hay papa");
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

exports.minify = function(file,type) {
	var result;

	

	if(type === 'js') {

		console.log("minify js...");
		
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

	}else if (type === 'css') {

		console.log("minify css...");

		result = new CleanCss().minify([file]);
		return result;
	}
}

/*exports.concat = function(f) {
	var files = [];
	console.log("concatenating...")
	f.forEach(function(val) {
		files.push(val.path);
	})
	console.log(files);
	return shell.cat(files);
}*/

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

/*exports.verifyMain = function(path, ext) {
	console.log(path);
	ext = ext || 'js';
	path.forEach(function (val) {
		var name, n;
		name = val.name.replace(/[\d\#.]+/g, "");
		n = val.path.search(name+'.'+ext);
		//n = val.path.search('bootstrap.css');
		console.log("ESTA ES N, " + n);
		if(n !== -1) {
		}else if (name === 'mathjs') {
			val.path = val.path;
		}else {
			val.path = val.path + "/" + name+'.'+ext;
		}
	});
	return path; 
}*/

exports.verifyMain = function(req, ext) {
	ext = ext || 'js';
	var tmp = [];
	req.forEach(function (item) {
		tmp.length = 0;
		if (Array.isArray(item.path)) {
			for (var j=0; j<item.path.length; j++) {
		        if (item.path[j].search(ext) != -1 && item.path[j].search(ext+'.map') == -1){
					tmp.push(item.path[j]);
				}
		    }
		} else{
			if (item.path.search(ext) != -1 && item.path.search(ext+'.map') == -1){
				tmp.push(item.path);
			}
		};		
	    //console.log(tmp);
		item.path = tmp.slice();
	});
	//console.log(req)
	return req; 
}

exports.concat = function(f) {
	var files = [];
	console.log(f);

	f.forEach(function(item) {
		item.path.forEach(function(p){
			files.push(p);
		});
	})

	//console.log(files);

	return shell.cat(files);
};

exports.verifyDependencies = function(req){
	var deferred = Q.defer();
	var files = Object.keys(req.query);
	var items = [];
	files.forEach(function(f){
		items.push({
			'name': f,
			'version': req.query[f]
		});
	});
	var path, bowerjson, response = [];
	items.forEach(function(item){
		path = 'bower_components/'+item.name;
		bowerjson = {};

		if (item.version == '') {
			path += '#last/';
		} else{
			path += '#' + item.version + '/';
		};

		path += 'bower.json';

		fs.readFile(path, 'utf-8', function(err,data) {
		    if (!err) {
		    	bowerjson = JSON.parse(data);
				if(bowerjson.dependencies != undefined){
			    	var dependencies = Object.keys(bowerjson.dependencies);
					dependencies.forEach(function(dep){
						var missing = true;
						files.forEach(function(f){
							if(dep == f){
								missing = false;
							}
						});
						if(missing){
							response.push({error: 'dependenciesMissing', message: dep+' of '+item.name});
						}
					});
				}
				deferred.resolve(response);
		    }else{
		        console.log(err);
		        deferred.reject("error");
		    }
		});
		

	});

	return  deferred.promise;
};