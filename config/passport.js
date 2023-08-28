const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//------------ Local User Model ------------//
const User = require('../models/User');

//------------ Redis Configuration ------------//
const redisClient = require('./redis');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'usernameOrEmail', passReqToCallback: true }, async (req, usernameOrEmail, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
          return done(null, false, { message: 'This username or email is not registered' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect! Please try again.' });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const redisKey = `user-${id}`;
      const cachedUser = await redisClient.get(redisKey);
      if (cachedUser) {
        return done(null, JSON.parse(cachedUser));
      }

      const user = await User.findById(id);
      if (user) {
        await redisClient.set(redisKey, JSON.stringify(user), 'EX', 60 * 60);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
