var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var _ = require('underscore');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('xpath', { title: 'Colenso Project' });
});

router.get('/query',function(req,res,next){
	//Perform the basex search and render the result 
	basex.searchXPath(req.query.xpath ,function(err,data){
		//use underscore to produce a new array of values
		//mapping each value in the list through a 
		//transformation adding the url and the title
		valueq = data;//  _.map(data,function(val){
		//return {
		//	url: '/xpath/' + val.path,title: val.title
		//	};
		//});
		//render page title and results to the search page
		res.render('xpath', { title: 'Colenso Project',valueofquery : valueq });
	});
});

module.exports = router;
