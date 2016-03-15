//declare namespace tei='http://www.tei-c.org/ns/1.0';

var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");
router.get("/",function(req,res){
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
" (//name[@type='place'])[1] ",
function (error, result) {
if(error){ console.error(error);}
else {
res.render('index', { title: 'ECS Video Rental', place: result.result });
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



module.exports = router;
