var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('results', { title: 'Colenso Project' });
});

router.get('/*', function(req, res, next) {	
	console.log("req " + req.title);
	//console.log("res " + res);
	//console.log("next " + next);
  res.render('results', { title: 'Colenso Project' });
});


module.exports = router;
