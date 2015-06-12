var Q = require('q');
var fs = require('fs');
var exec = require('child_process').exec;
var jqueryCB = require('./libraries/jquery/jqueryCB');


var exports = module.exports = {};

exports.customBuild = function(f,obj) {
	var child, deferred = Q.defer();
	
	if(f === 'jquery') {
		jqueryCB.install(f,obj)
			.then(function(){
				deferred.resolve(true);
			},function(err){
				deferred.reject(err);
			});
		
	}else {
		console.log("err Custom Build");
		return deferred.reject("error");
	}

	return  deferred.promise;

}




