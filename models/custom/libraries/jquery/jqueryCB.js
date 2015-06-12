var Q = require('q');
var fs = require('fs');
var exec = require('child_process').exec;

var exports = module.exports = {};

var bowerDefault = {
	"name": "jquery",
	"version": "custom",
	"main": "jquery-custom.js"
};

exports.install = function(f,obj) {
	var child, deferred = Q.defer();

	console.log("Custom Build Jquery...");

	child = exec('mkdir -p bower_components/jquery#custom');

	child.stdout.on('end',function() {
		var child;
		fs.writeFile('bower_components/jquery#custom/.bower.json', JSON.stringify(bowerDefault), function (err) {
			if (err) throw err;
			console.log("create file .bower.json");
		});

		if(typeof obj.modules !== "undefined" && typeof obj.version !== "undefined"){
			if(obj.modules.length > 0) {
				var modules = obj.modules.join(",");
				console.log(modules);
				child = exec('jquery-builder -v '+ obj.version + ' --exclude '+ modules ,
					function(err,stdout,stderr){
	    				if (stdout === 'Not Found') {
	    					deferred.reject(exports.errorMsg("VERSIONBAD"));
	    				}else {
	    					fs.writeFileSync('bower_components/jquery#custom/jquery-custom.js', stdout);
	    					deferred.resolve(true);
	    				}
					});
			}else{
				deferred.reject(exports.errorMsg("EMPTYMODULES"));
			}
		}else {
			deferred.reject(exports.errorMsg("PARAMBAD"));
		}
	});

	return  deferred.promise;
};

exports.listVersions = function() {
	var child, deferred = Q.defer();

	console.log("List Build Jquery...");

	child = exec('jquery-builder -s', function(err,stdout,stderr){
					deferred.resolve(stdout);
			});

	return deferred.promise;
}

exports.errorMsg = function(error) {
	var errorList,err,msg, deferred = Q.defer();

	versions = JSON.parse(fs.readFileSync('./models/custom/libraries/jquery/jqueryVersions.json','utf-8'));

	if(error === "VERSIONBAD") {
		err = {
			"code" : 400,
			"msg" : "Not version found",
			"file": "",
			"extra" : versions
		}
	}else if (error === "PARAMBAD"){
		err = {
			"code" : 409,
			"msg" : "Wrong parameter",
			"file" : "",
			"extra" : "parameter must be version or modules key"
		}
	}else if (error === "EMPTYMODULES") {
		err = {
			"code" : 409,
			"msg" : "Empty modules.",
			"file" : "",
			"extra" : ""
		}
	}

	return err;
}
