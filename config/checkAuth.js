const passport = require('passport');
const User = require('../models/User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//------------ Routing via Auth ------------//
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log('Session:', req.session);
    console.log('User:', req.user);

    if (req.isAuthenticated()) {
      return next();
    }

    req.flash('error_msg', 'Please log in first!');
    res.redirect('/auth/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
};
