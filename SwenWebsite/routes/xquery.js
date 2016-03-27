var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('xquery', { title: 'Colenso Project' });
});

router.get('/query',function(req,res,next){
	console.log("why is this undefined" + req.query.xquery);
	//Perform the basex search and render the result 
	basex.XQuery(req.query.xquery ,function(err,data){
		
		if(err){
		console.log(err);

		}
		else{
		//render page title and results to the search page
		res.render('xquery', { title: 'Colenso Project',valueofquery : data.result });
		}
	});
});

module.exports = router;
