const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

const themeFiles = ['add-post', 'blog-single', 'blog', 'chat-video', 'chat', 'edit-profile', 'file-manager', 'index', 'to-do', 'user-profile'];

router.use('/${file}', ensureAuthenticated, (req, res, next) => {
  next();
});

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
  res.render('login');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    layout: 'theme/layout',
    name: req.user.name,
  })
);

//------------ Grouped Theme Routes ------------//

themeFiles.forEach((file) => {
  router.get(`/${file}`, ensureAuthenticated, (req, res) =>
    res.render(`theme/${file}`, {
      layout: 'theme/layout',
      name: req.user.name,
    })
  );
});

module.exports = router;
