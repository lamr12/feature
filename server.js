var express = require('express');
var apiBower = require('./bowerTest.js');
var Q = require('q');

var app = express(); 

var object = { 'jquery':'last','underscore':'last','angular':'last', 'amplify':'last'}

var installPackages = function(packages) {
	var count,
		promises;

	count = Object.keys(packages).length;
	promises = [];

	if(count > 1) {
		Object.keys(packages).forEach(function (val,index) {
		var deferred = Q.defer();
 			apiBower.searchPackage(val)
		 		.then(function (data) {
	 			if(!data) {
	 				apiBower.installPackage(val)
	 					.then(function (data) {
	 						apiBower.listPackage()
	 							.then(function (data) {
	 								deferred.resolve(data);
	 							})
	 					})
	 			}
	 		})
		 	promises.push(deferred.promise);
	 	});

	 	return Q.all(promises);
	}
}

installPackages(object).then(function (data) {
	var count,
		object;

	count = Object.keys(data).length;
	console.log(data[0]);
});
	
var html_dir = 'js/archivo.js';

app.get('/', function(req, res) {
	
    res.end("hola inicio");
   
});

app.get('/yourapi', function(req, res) {
	setTimeout(function(){
      res.sendfile(html_dir);
    }, 33000);
});

app.listen(3000, "127.0.0.1");

console.log('Server running at http://127.0.0.1:3000/');
