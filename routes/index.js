const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

// Welcome Route
router.get('/', (req, res) => {
  res.render('login');
});

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/add-post', ensureAuthenticated, (req, res) =>
  res.render('theme/add-post', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/blog-single', ensureAuthenticated, (req, res) =>
  res.render('theme/blog-single', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/blog', ensureAuthenticated, (req, res) =>
  res.render('theme/blog', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/chat-video', ensureAuthenticated, (req, res) =>
  res.render('theme/chat-video', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/chat', ensureAuthenticated, (req, res) =>
  res.render('theme/chat', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/edit-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/edit-profile', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/file-manager', ensureAuthenticated, (req, res) =>
  res.render('theme/file-manager', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/index', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/to-do', ensureAuthenticated, (req, res) =>
  res.render('theme/to-do', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

router.get('/user-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/user-profile', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

module.exports = router;
