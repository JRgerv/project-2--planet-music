var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig'); //requires the passport config we wrote
var router = express.Router();

//define routes
router.get('/login', function(req, res){
  res.render('auth/login'); //login page
});

router.post('/login', passport.authenticate('local', { //POST login information and redirect appropriately
  successRedirect: '/',
  successFlash: "Good, you logged in!",
  failureRedirect: "/auth/login",
  failureFlash: "Invalid Credentials. Try again."
}));

router.get('/signup', function(req, res){
  res.render('auth/signup');   //render signup page
});

router.post('/signup', function(req, res){
  console.log(req.body);
  db.user.findOrCreate({
    where: {email: req.body.email}, ////find or create user depending on if statement
    defaults: {
      location: req.body.location,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
  }).spread(function(user, wasCreated){ //returns boolean created or not
    if(wasCreated){
      //good
      passport.authenticate('local', {
        successRedirect: "/",
        successFlash: "Account created and logged in. You're ready to go!"
      })(req,res);
    } else{
      //already found, bad
      req.flash('error', 'Email already exists!');
      res.redirect('/auth/login');
    }
  }).catch(function(err){
    req.flash("Oops! Error: ", err.message);
    res.redirect("/auth/signup");
  });
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash("You logged out :("); //Logout and go to login page
  res.redirect('/auth/login');
});

router.get('/facebook',passport.authenticate('facebook', { //facebook login
  scope: ['public_profile', 'email']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
  successRedirect: '/profile',
  successFlash: 'You are now logged in via Facebook',
  failureRedirect:'/auth/login',
  failureFlash: 'Facebook credentials not recognized'
}));

//export
module.exports = router;
