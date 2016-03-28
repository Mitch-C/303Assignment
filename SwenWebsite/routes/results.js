var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/*/download', function(req, res, next) {
    console.log("look at this one" + req.url);

    var url = req.url.replace(/\/download\/?/, "");
    // var url = "/Colenso/private_letters/PrL-0001.xml"

    basex.getDocument(url, function(err, doc) {
        if (err) console.log(err);
        var name = url
        res.setHeader('Content-disposition', 'attachment; filename=' + name);
        res.setHeader('Content-type', 'text/xml');
        res.write(doc, 'utf-8');

        res.end();
    });

});

router.get('/*', function(req, res, next) {
    // var url = "/Colenso/private_letters/PrL-0001.xml"
    //console.log(req.url);

    var url = req.url.replace(/%20/g, " ").slice(0, -1);



    console.log("this one nigga " + url);
    basex.getDocument(url, function(err, doc) {
        if (err) console.log(err);
        res.render('results', {
            title: 'Colenso',
            doc: doc
        });
    });
});



module.exports = router;