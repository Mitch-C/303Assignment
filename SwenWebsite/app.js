var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');
var xquery = require('./routes/xquery');
var xpath = require('./routes/xpath');
var results = require('./routes/results');

var app = express();
var query = "";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/search',search);
app.use('/xpath',xpath);
app.use('/xquery',xquery);
app.use('/results',results);

/*app.post('/search', function (req, res) {
  console.log('Username: ' + req.body.username);
res.render('search', { title: 'Colenso Project', valueofquery : req.body.username});// instead of printing on the page i want to request from the database and return the query 
 query = req.body.username;
 app.locals.query = req.body.username;
 res.send('search');
 });

*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
