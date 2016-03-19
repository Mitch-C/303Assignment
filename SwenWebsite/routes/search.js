var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var _ = require('underscore');


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('search', { title: 'Colenso Project' });
  next();
});

//retrieve users search 
router.get('/query',function(req,res,next){
		basex.search(req.query.query ,function(err,data){
			valueq = _.map(data,function(ele){
				return {
					url: '/search/' + ele.path.replace(/\.xml$/,'view')//,title = ele.title
				};
			});
			    
        
		
		res.render('search', { title: 'Colenso Project',valueofquery : valueq });
	});
});

module.exports = router;
