var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/', function(req, res, next) {
    basex.browseDatabase(req, function(err, data) {
        if (err) {
            console.log(err);
        }
        for( i = 0 ; i <10;i++){
        	if(data[i].indexOf("colenso")>=0){console.log('this is a colenso file :' + data[i])}
        }
        res.render('browse', {
            title: 'Colenso Project',
            results: data
        });
    });

});




module.exports = router;