var express = require('express');
var app = express(); 

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
