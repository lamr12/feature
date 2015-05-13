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

exports.installPackage = function(fileName) {
	var deferred = Q.defer();
	console.log("iniciando proceso de instalacion");
	bower.commands
		.install([fileName], { save: true }, {/* custom config*/})
		.on('end', function (result) {
			console.log("instalando Paquetes...");
			console.log(result);
			deferred.resolve(true);
		})
		.on('error', function (err) {
			if(err.code === "ECONFLICT") {
				deferred.reject("Error de conflicto");
			}

			if (err.code === "ENOTFOUND" || err.code === "ENORESTARGET") {
				deferred.reject("Archivo no encontrado"); 				
 			}
		})

	return deferred.promise;
};


exports.listPackage = function() {
	var deferred = Q.defer();

	bower.commands
		.list({paths:true})
		.on('end', function (data) {
			console.log("listando Paquetes...");
			console.log(data);

			deferred.resolve(data);
			
		})
		.on('error', function (err) {
			console.log("Error listando Paquetes...");
			deferred.reject("error");
		})

	return deferred.promise;
};

exports.searchPackage = function(name) {
	var deferred = Q.defer();

	bower.commands
		.list({paths:true})
		.on('end', function (data) {
			console.log("buscando paquetes...");
			console.log(data);
			if(Object.keys(data).lenght > 0) {
				Object.keys(data).forEach(function(p) {
					if(name === p) {
						deferred.resolve
						(
							{
								'exist':true,
								'name':p,
								'path':data[p]
							}
						);
					} else {
						deferred.resolve(false);
					}	
				});
			}else {
				deferred.resolve(false);
			} 
		})
		.on('error', function (err) {
			console.log(err)
			deferred.reject("error");
		})

	return deferred.promise;
};

exports.minify = function(file) {
	var result;

	result = uglifyJS.minify('file', {
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

	fs.writeFileSync('compile.min.js', result.code);
}

exports.concat = function(files) {
	console.log("concatenando...")
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

exports.verifyMain = function(file, path) {
	var n = path[file].search(file+".js");
	console.log("verificando");
	if(n !== -1) {
		return path;
	}else {
		path[file] = path[file] + "/" + file+".js";
		return 	path; 
	}
	// return n ;
}
