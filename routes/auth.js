const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController');

//------------ Login Route ------------//
router
  .route('/login')
  .get((req, res) => res.render('login'))
  .post(authController.loginHandle);

//------------ Forgot Password Route ------------//
router
  .route('/forgot')
  .get((req, res) => res.render('forgot'))
  .post(authController.forgotPassword);

//------------ Reset Password Route ------------//
router
  .route('/reset/:id')
  .get((req, res) => res.render('reset', { id: req.params.id }))
  .post(authController.resetPassword);

//------------ Register Route ------------//
router
  .route('/register')
  .get((req, res) => res.render('register'))
  .post(authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

// Rute untuk memulai autentikasi Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rute untuk callback autentikasi Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), async (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;
