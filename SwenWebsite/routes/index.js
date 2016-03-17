//declare namespace tei='http://www.tei-c.org/ns/1.0';

var express = require('express');
var router = express.Router();
var basex = require('basex');
var bodyParser     =        require("body-parser");
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.bodyParser());
client.execute("OPEN Colenso");
router.get("/",function(req,res){
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
" (//name[@type='place'])[1] ",
function (error, result) {
if(error){ console.error(error);}
else {
res.render('index', { title: 'Colenso Project', place: result.result });
}
}
);
});

/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

console.log(1);


module.exports = router;
