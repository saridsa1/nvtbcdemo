var express = require('express');
var router = express.Router();
var async = require('async');

var loggedInUsers = [];

router.get('/', function (req, res, next) {
		res.render('login', { flash: {} } );
});

router.get('/home', function(req, res, next) {
  res.render('index', {isSuperUser: req.session.isSuperUser});
});

router.get('/:page', function(req, res, next) {
    res.render(req.params.page, {page: req.params.page, loggedInUser: req.session.loggedInUser.toUpperCase(), isSuperUser: req.session.isSuperUser});
});

router.post('/login', function (req, res, next) {

		// you might like to do a database look-up or something more scalable here

		if (req.body.fivetwoone) {
      loggedInUsers.push(req.body.fivetwoone)
			req.session.authenticated = true;
      req.session.isSuperUser = false;
      req.session.loggedInUser = req.body.fivetwoone;

      if(req.body.fivetwoone.toUpperCase() === "SARIDSA1") {
        req.session.isSuperUser = true;
      }
      console.log(req.session.isSuperUser)
      res.redirect('/home');
		} else {
			req.flash('error', 'Please enter a valid 5-2-1 ID');
			res.redirect('/login');
		}

});
module.exports = router;
