const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

// Welcome Route
router.get('/', (req, res) => {
  res.render('login');
});

// Dashboard Route
router.get('/dashboard', (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
  })
);

router.get('/add-post', (req, res) =>
  res.render('theme/add-post', {
    layout: 'theme/layout',
  })
);

router.get('/blog-single', (req, res) =>
  res.render('theme/blog-single', {
    layout: 'theme/layout',
  })
);

router.get('/blog', (req, res) =>
  res.render('theme/blog', {
    layout: 'theme/layout',
  })
);

router.get('/chat-video', (req, res) =>
  res.render('theme/chat-video', {
    layout: 'theme/layout',
  })
);

router.get('/chat', (req, res) =>
  res.render('theme/chat', {
    layout: 'theme/layout',
  })
);

router.get('/edit-profile', (req, res) =>
  res.render('theme/edit-profile', {
    layout: 'theme/layout',
  })
);

router.get('/file-manager', (req, res) =>
  res.render('theme/file-manager', {
    layout: 'theme/layout',
  })
);

router.get('/index', (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
  })
);

router.get('/to-do', (req, res) =>
  res.render('theme/to-do', {
    layout: 'theme/layout',
  })
);

router.get('/user-profile', (req, res) =>
  res.render('theme/user-profile', {
    layout: 'theme/layout',
  })
);

module.exports = router;
