var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
var fs = require('fs'); // http://www.tutorialspoint.com/nodejs/nodejs_file_system.htm
var multer = require('multer');
var upload = multer({
    dest: '/tmp/'
});
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin', {
        title: 'Colenso Project'
    });
});


module.exports = router;