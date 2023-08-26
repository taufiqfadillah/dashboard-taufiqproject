const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = require('express')();
app.use(cookieParser());

//------------ Creating Session ------------//
const session = require('express-session');
const MongoStore = require('connect-mongo');

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Successfully connected to MongoDB👌👌👌'))
  .catch((err) => console.log(err));

//------------ Model Configure ------------//
const Blog = require('./models/Blog');

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//------------ Cookie-Parser ------------//
app.get('/set-cookie', (req, res) => {
  res.cookie('cookieName', 'cookieValue', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.send('Cookie has been set.');
});

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: true }));

//------------ Express session Configuration ------------//
app.use(
  session({
    name: 'Taufiqproject',
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove: 'native',
      ttl: 7 * 24 * 60 * 60,
      stringify: false,
    }),
  })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log('Error in Finding User --> Passport');
    return done(err);
  }
});

//------------ Blog API ------------//
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({}, { _id: 1, slug: 1, title: 1, image: 1, category: 1, date: 1, comments: 1, shares: 1, content: 1, author: 1, likes: 1 }).sort({ createdAt: -1 }).lean();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${process.env.CLIENT_URL}`));
