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
		
		res.render('search', { title: 'Colenso Project',valueofquery : req.query.query });
	

});

module.exports = router;
