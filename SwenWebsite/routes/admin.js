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

router.post('/new', upload.single('newDoc'), function(req, res, next) {
    var path = req.body.path;
    fs.readFile(req.file.path, function(err, data) {
        if (err) {
            console.log(err);
            req.session.error = err;
            res.redirect('/admin');
            return;
        }
        basex.addDocument(path, data, function(err, data) {
            if (err) {
                console.log(err);
                //req.session.error = err;
                res.redirect('/admin');
                return;
            }
            // console.log(data);
            fs.unlinkSync(req.file.path);
            res.redirect('/browse');
        });
    });
});

module.exports = router;