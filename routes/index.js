const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

// Middleware to check if user is authenticated
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }

// Welcome Route
router.get('/', (req, res) => {
  res.render('login');
});

// Protected routes
// router.use(ensureAuthenticated);

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/add-post', (req, res) =>
  res.render('theme/add-post', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/blog-single', (req, res) =>
  res.render('theme/blog-single', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/blog', (req, res) =>
  res.render('theme/blog', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/chat-video', (req, res) =>
  res.render('theme/chat-video', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/chat', (req, res) =>
  res.render('theme/chat', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/edit-profile', (req, res) =>
  res.render('theme/edit-profile', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/file-manager', (req, res) =>
  res.render('theme/file-manager', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/index', (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/to-do', (req, res) =>
  res.render('theme/to-do', {
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/user-profile', (req, res) =>
  res.render('theme/user-profile', {
    layout: 'theme/layout',
  })
);

module.exports = router;
