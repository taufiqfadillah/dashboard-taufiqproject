const User = require('../models/User');

//------------ Routing via Auth ------------//
module.exports = {
  ensureAuthenticated: async function (req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const user = await User.findById(req.user._id);
        if (user && user.isLoggedIn === true) {
          return next();
        } else {
          req.flash('error_msg', 'Please log in first!');
          return res.redirect('/auth/login');
        }
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        return res.redirect('/auth/login');
      }
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
