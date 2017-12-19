var express = require('express');
var i18n = require('i18n');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);
app.use(express.static(path.join(__dirname, 'public')));

// Custom code

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
  var secureList = ['/home','/index', '/hash', '/block', '/blockchain', '/tokens', '/distributed', '/coinbase'];
	if (secureList.indexOf(req.url) > -1 && (!req.session || !req.session.authenticated)) {
		res.render('unauthorised', { status: 403 });
		return;
	}

	next();
}
app.use(checkAuth);
// Custom code

app.use('/', routes);

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

i18n.configure({
  locales:['en', 'ja', 'pt', 'es', 'pl'],
  directory: __dirname + '/locales'
});

module.exports = app;
