const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ensureAuthenticated } = require('../config/checkAuth');

//------------ User Model ------------//
const User = require('../models/User');

//------------ Blog Model ------------//
const Blog = require('../models/Blog');

//------------ To-do Model ------------//
const Todo = require('../models/ToDo');

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

// Add-Post
router.get('/add-post', ensureAuthenticated, (req, res) =>
  res.render('theme/add-post', {
    title: 'Taufiq Project || Add Post',
    layout: 'theme/layout',
    user: req.user,
  })
);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/dashboard/blog');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/add-post', upload.single('image'), async (req, res) => {
  try {
    const { title, type, category, content } = req.body;
    const image = req.file ? req.file.originalname : '';

    const newBlog = new Blog({
      title,
      type,
      category,
      content,
      image,
      user: req.user._id,
      author: req.user.name,
    });

    const savedBlog = await newBlog.save();
    console.log('Saved Blog:', savedBlog);
    res.redirect('/blog');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('theme/add-post', { message: 'An error occurred while adding the post.' });
  }
});

// Blog Routes
router.get('/blog', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    res.render('theme/blog', {
      title: 'Taufiq Project || My Blog',
      layout: 'theme/layout',
      user: req.user,
      blogs: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Blog-Single Route
router.get('/blog-single/:slug', ensureAuthenticated, async (req, res) => {
  try {
    const slug = req.params.slug; // Ambil slug dari parameter URL
    const blog = await Blog.findOne({ slug }); // Ambil data blog dari database berdasarkan slug

    res.render('theme/blog-single', {
      title: `Taufiq Project || ${blog.title}`,
      layout: 'theme/layout',
      user: req.user,
      blog: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi Kesalahan Server');
  }
});

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
    title: 'Taufiq Project || Edit My Profile',
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

// ToDo Routes
router.get('/to-do', ensureAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ creator: req.user._id });
    const completedCount = await Todo.countDocuments({ creator: req.user._id, status: 'Completed' });
    const inProgressCount = await Todo.countDocuments({ creator: req.user._id, status: 'In Progress' });
    const allTaskCount = todos.length;
    const trashCount = await Todo.countDocuments({ creator: req.user._id, status: 'Trash' });

    res.render('theme/to-do', {
      title: 'Taufiq Project || To-Do',
      layout: 'theme/layout',
      user: req.user,
      todos: todos,
      completedCount: completedCount,
      inProgressCount: inProgressCount,
      allTaskCount: allTaskCount,
      trashCount: trashCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/add-task', ensureAuthenticated, async (req, res) => {
  try {
    const newTask = new Todo({
      task: req.body.task,
      creator: req.user._id,
    });
    await newTask.save();
    res.status(200).json({ message: 'Task added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/update-status/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.status = 'Completed';
      await todo.save();
      res.status(200).json({ message: 'Task status updated successfully!' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/delete-task/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (todo) {
      res.status(200).json({ message: 'Task deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/user-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/user-profile', {
    title: 'Taufiq Project || My Profile',
    layout: 'theme/layout',
    user: req.user,
  })
);

// Blog API
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const formattedBlogs = blogs.map((blog) => {
      return JSON.stringify(
        {
          id: blog._id,
          slug: blog.slug,
          title: blog.title,
          image: blog.image,
          category: blog.category,
          date: blog.date,
          comments: blog.comments,
          shares: blog.shares,
          content: blog.content,
          author: blog.author,
          likes: blog.likes,
        },
        null,
        2 // Indentation level for formatting
      );
    });

    res.type('json').send(`[${formattedBlogs.join(',\n\n')}]`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
