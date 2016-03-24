var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('results', { title: 'Colenso Project' });
});

router.get('/*', function(req, res, next) {	
	console.log("req " + res.title);
	console.log("res " + res.title);
	//console.log("next " + next);
	query = req;
  res.render('results', { title: 'Colenso Project' , query:query});
});


module.exports = router;
