//------------ Routing via Auth ------------//
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log('Session:', req.session);
    console.log('User:', req.user);

    if (!req.isAuthenticated()) {
      req.flash('error_msg', 'Please log in first!');
      return res.redirect('/auth/login');
    }

    next();
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  blockAccessToRoot: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    next();
  },
};
