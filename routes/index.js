const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController');

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
  res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dash', {
    fullname: req.user.fullname,
  })
);

module.exports = router;
