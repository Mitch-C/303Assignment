//declare namespace tei='http://www.tei-c.org/ns/1.0';
var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var query = "query has not been set";
//retrieve query


client.execute("OPEN Colenso");
router.get("/", function(req, res) {
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        " (//name[@type='place'])[1] ",
        function(error, result) {
            if (error) {
                console.error(error);
            } else {
                res.render('index', {
                    title: 'Colenso Project',
                    place: result.result,
                    valueofquery: query
                });
            }
        }
    );
});

/* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express' });
//});
//try connecting to server
console.log(1);

module.exports.myhandler = function(req, res) {
    query = req.app.locals.query;

};


module.exports = router;