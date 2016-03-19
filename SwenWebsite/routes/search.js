var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");



/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('search', { title: 'Colenso Project' });
  next();
});

//retrieve users search 
router.get('/query',function(req,res,next){
		console.log('why is this not being called?');
		res.render('search', { title: 'Colenso Project - retrieved query',valueofquery : 'changed' });
	

});

module.exports = router;
