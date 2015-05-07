var bower = require('bower');
var Q = require('q');
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

	bower.commands
		.install([fileName], { save: true }, {/* custom config*/})
		.on('end', function (result) {
			deferred.resolve(true);
		})
		.on('error', function (err) {
			if (err.code === "ENOTFOUND") {
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

			deferred.resolve(data);
			
		})
		.on('error', function (err) {
			deferred.reject("error");
		})

	return deferred.promise;
};

exports.searchPackage = function(name) {
	var deferred = Q.defer();

	bower.commands
		.list({paths:true})
		.on('end', function (data) {
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
			deferred.reject("error");
		})

	return deferred.promise;
};
