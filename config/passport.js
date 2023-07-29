const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//------------ Local User Model ------------//
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //------------ User Matching ------------//
      User.findOne({
        email: email,
      }).then((users) => {
        if (!users) {
          return done(null, false, { message: 'This email ID is not registered' });
        }

        //------------ Password Matching ------------//
        bcrypt.compare(password, users.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, users);
          } else {
            return done(null, false, { message: 'Password incorrect! Please try again.' });
          }
        });
      });
    })
  );

  passport.serializeUser(function (users, done) {
    done(null, users.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, users) {
      done(err, users);
    });
  });
};
