var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('results', { title: 'Colenso Project' });
});

router.get('/*', function(req, res, next){
 //var url = "/Colenso/private_letters/PrL-0001.xml"
 var url = req.url.replace(/%20/g, " ");
 console.log("look at me " +url);
   basex.getDocument(url , function(err, doc) {
    if (err) console.log(err);
    res.render('results', { title: 'Colenso', doc:doc});
  });
});



module.exports = router;
