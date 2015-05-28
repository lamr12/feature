var express = require('express')
  , router = express.Router()
  , Compile = require('./compile');

router.get('/', function(req, res) {
  Compile.test();
  res.end("Mixer.js");  
})

router.get('/compile.js', function(req, res) {
  Compile.compile(req, res, 'js');
})

router.get('/compile.min.js', function(req, res) {
  Compile.compile(req, res, 'js', true);
})

router.get('/compile.css', function(req, res) {
  Compile.compile(req, res, 'css');
})

router.get('/compile.min.css', function(req, res) {
  Compile.compile(req, res, 'css', true);
})


module.exports = router