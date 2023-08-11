const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

//------------ User Model ------------//
const User = require('../models/User');

// Welcome Route
router.get('/', (req, res) => {
  res.render('login');
});

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    title: 'Taufiq Project || Dashboard',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/add-post', ensureAuthenticated, (req, res) =>
  res.render('theme/add-post', {
    title: 'Taufiq Project || Add Post',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/blog-single', ensureAuthenticated, (req, res) =>
  res.render('theme/blog-single', {
    title: 'Taufiq Project || Blog Single',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/blog', ensureAuthenticated, (req, res) =>
  res.render('theme/blog', {
    title: 'Taufiq Project || Blog',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/chat-video', ensureAuthenticated, (req, res) =>
  res.render('theme/comingsoon', {
    title: 'Taufiq Project || Coming Soon😶‍🌫️',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/chat', ensureAuthenticated, (req, res) =>
  res.render('theme/comingsoon', {
    title: 'Taufiq Project || Coming Soon😶‍🌫️',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/edit-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/edit-profile', {
    title: 'Taufiq Project || Edit Profile',
    layout: 'theme/layout',
    user: req.user,
  })
);

// Route to handle profile updates
router.post('/edit-profile', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, name, bio, address, website, instagram, twitter, facebook, linkedin, aboutme, university, contact, bod, hobby } = req.body;

    // Find the user by their ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        name,
        bio,
        address,
        website,
        instagram,
        twitter,
        facebook,
        linkedin,
        aboutme,
        university,
        contact,
        bod,
        hobby,
      },
      { new: true }
    );

    res.redirect('/user-profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/file-manager', ensureAuthenticated, (req, res) =>
  res.render('theme/comingsoon', {
    title: 'Taufiq Project || Coming Soon😶‍🌫️',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/to-do', ensureAuthenticated, (req, res) =>
  res.render('theme/to-do', {
    title: 'Taufiq Project || To-Do',
    layout: 'theme/layout',
    user: req.user,
  })
);

router.get('/user-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/user-profile', {
    title: 'Taufiq Project || User Profile',
    layout: 'theme/layout',
    user: req.user,
  })
);

module.exports = router;
