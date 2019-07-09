const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/signin', (req, res) => {
  res.render('authentication/signin');
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/signup', (req, res) => {
    res.render('authentication/signup');
  });

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile',isLoggedIn,(req,res,next)=>{
  res.render('profile');
});

router.get('/logout',(req,res,next)=>{
  req.logOut();
  res.redirect('/');
});

module.exports = router;