const express = require('express');
const router = express.Router();
const { format } = require('date-fns');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const fileUpload = require('express-fileupload');
const { ensureAuthenticated, blockAccessToRoot } = require('../config/checkAuth');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const sendNotification = require('./notification');

//------------ App Configure ------------//
const app = express();
app.use(fileUpload());

//------------ Model Configure ------------//
const User = require('../models/User');
const Blog = require('../models/Blog');
const Todo = require('../models/ToDo');

//------------ Supabase Configure ------------//
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

//------------ Welcome Route ------------//
router.get('/', blockAccessToRoot, (req, res) => {
  res.render('login');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('theme/index', {
    title: 'Taufiq Project || Dashboard',
    layout: 'theme/layout',
    user: req.user,
  })
);

//------------ Blog Route ------------//
// Add Blog
router.get('/add-post', ensureAuthenticated, (req, res) =>
  res.render('theme/add-post', {
    title: 'Taufiq Project || Add Post',
    layout: 'theme/layout',
    user: req.user,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add-post', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, type, category, date, content } = req.body;
    let image = '';
    if (req.file) {
      const originalName = req.file.originalname;
      const fileExt = path.extname(originalName);
      const newFileName = `${title}_${format(new Date(), 'yyyyMMddHHmmss')}${fileExt}`;

      const { data, error } = await supabase.storage.from('taufiqproject/blog').upload(newFileName, req.file.buffer);
      if (error) throw error;
      image = newFileName;
    }
    const newBlog = new Blog({
      title,
      type,
      category,
      date,
      content,
      image,
      user: req.user._id,
      author: req.user.name,
    });
    const savedBlog = await newBlog.save();
    console.log('Saved Blog:', savedBlog);

    sendNotification('Blog Post Added', 'Your new blog post has been successfully added!');

    res.redirect('/blog');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('theme/add-post', { message: 'An error occurred while adding the post.' });
  }
});

// Blog View
router.get('/blog', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ user: userId }).sort({ date: -1 }).limit(10);
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

// Blog-Single View
router.get('/blog-single/:slug', ensureAuthenticated, async (req, res) => {
  try {
    const slug = req.params.slug;
    const blog = await Blog.findOne({ slug });

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

// Blog List View
router.get('/blogs-list', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    res.render('theme/blogs-list', {
      title: 'Taufiq Project || Blogs List',
      layout: 'theme/layout',
      user: req.user,
      blogs: blogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Blog
router.get('/edit-blog/:id', ensureAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    const categories = ['Lifestyle', 'Technology', 'Politics', 'Law', 'Industry', 'Travel', 'Otomotif', 'Sport', 'Game'];

    res.render('theme/edit-blog', {
      title: 'Taufiq Project || Edit Blog',
      layout: 'theme/layout',
      user: req.user,
      blog: blog,
      categories: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Blog
router.post('/update-blog/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, type, category, date, content } = req.body;

    const existingBlog = await Blog.findById(blogId);

    const imageExt = req.file ? path.extname(req.file.originalname) : path.extname(existingBlog.image);
    const newImageName = `${title}_${format(new Date(), 'yyyyMMddHHmmss')}${imageExt}`;

    if (req.file) {
      const { data, error } = await supabase.storage.from('taufiqproject/blog').upload(newImageName, req.file.buffer);
      if (error) throw error;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        type,
        category,
        date,
        content,
        image: req.file ? newImageName : existingBlog.image,
      },
      { new: true }
    );

    if (req.file && existingBlog.image !== req.file.originalname) {
      const { data, error } = await supabase.storage.from('taufiqproject/blog').remove(existingBlog.image);
      if (error) {
        console.error('Error deleting old image from Supabase:', error);
      }
    }
    sendNotification('Blog Post Updated', 'Your blog post has been updated!');
    res.redirect('/blog');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Blog
router.post('/delete-blog/:id', ensureAuthenticated, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).send('Permission denied');
    }

    console.log('Deleting image:', blog.image);

    if (blog.image) {
      const { data, error } = await supabase.storage.from('taufiqproject/blog').remove(blog.image);
      if (error) {
        console.error('Error deleting image from Supabase:', error);
      }
    }

    await blog.remove();
    sendNotification('Blog Post Deleted', 'Your blog post has been deleted!');
    res.redirect('/blog');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//------------ Chat Route ------------//
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

//------------ Profile Route ------------//
// Edit Profile View
router.get('/edit-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/edit-profile', {
    title: 'Taufiq Project || Edit My Profile',
    layout: 'theme/layout',
    user: req.user,
  })
);

// Edit Profile Handle
router.post('/edit-profile', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, name, bio, address, website, instagram, twitter, facebook, linkedin, aboutme, university, contact, bod, hobby } = req.body;
    let newImage = req.user.image;

    if (req.file) {
      const file = req.file;
      const fileName = `${req.user.name}_${Date.now()}`;

      const processedImage = await sharp(file.buffer).resize({ width: 300, height: 300, fit: 'cover' }).toBuffer();

      const { data, error } = await supabase.storage.from('taufiqproject/user').upload(fileName, processedImage, {
        contentType: file.mimetype,
      });

      if (error) {
        console.error(error);
        return res.status(500).send('Failed to upload image');
      }

      newImage = fileName;
    }

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
        image: newImage,
      },
      { new: true }
    );
    sendNotification('Edit Profile', 'Your profile has been edit successfully!');
    res.redirect('/user-profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Profile View
router.get('/user-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/user-profile', {
    title: 'Taufiq Project || My Profile',
    layout: 'theme/layout',
    user: req.user,
  })
);

//------------ Change Password View ------------//
router.get('/password-profile', ensureAuthenticated, (req, res) =>
  res.render('theme/password-profile', {
    title: 'Taufiq Project || Change Password',
    layout: 'theme/layout',
    user: req.user,
  })
);

//------------ Change Password Route ------------//
router.post('/change-password', ensureAuthenticated, async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const user = req.user;

    if (newPassword !== confirmPassword) {
      return res.status(400).render('theme/password-profile', { message: 'New password and confirm password do not match.' });
    }

    if (user.verified) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(user._id, { password: hashedNewPassword, verified: false });

      sendNotification('Change Password', 'Your account has been successfully changed password!');

      res.redirect('/user-profile');
    } else {
      const { currentPassword } = req.body;
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).render('theme/password-profile', { message: 'Current password is incorrect.' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

      sendNotification('Change Password', 'Your account has been successfully changed password!');

      res.redirect('/user-profile');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//------------ File Manager Route ------------//
router.get('/file-manager', ensureAuthenticated, (req, res) =>
  res.render('theme/comingsoon', {
    title: 'Taufiq Project || Coming Soon😶‍🌫️',
    layout: 'theme/layout',
    user: req.user,
  })
);

//------------ ToDo Route ------------//
// Todo View
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

// Add Task
router.post('/add-task', ensureAuthenticated, async (req, res) => {
  try {
    const newTask = new Todo({
      task: req.body.task,
      creator: req.user._id,
    });
    await newTask.save();
    sendNotification('Todo Added', 'Your new todo has been successfully added!');
    res.status(200).json({ message: 'Task added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update Task
router.post('/update-status/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.status = 'Completed';
      await todo.save();
      sendNotification('Todo Updated', 'Your todo has been successfully updated!');
      res.status(200).json({ message: 'Task status updated successfully!' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Task
router.post('/delete-task/:id', ensureAuthenticated, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (todo) {
      sendNotification('Todo Deleted', 'Your todo has been deleted!');
      res.status(200).json({ message: 'Task deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
