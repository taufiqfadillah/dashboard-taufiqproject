const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const flash = require('connect-flash');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(compression());
app.use(cookieParser());
app.use(cors());

//------------ Creating Session ------------//
const session = require('express-session');
const MongoStore = require('connect-mongo');

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ Socket.io Configuration ------------//
const configureSocket = require('./config/socket');
const io = configureSocket(server);
app.set('io', io);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Successfully connected to MongoDB👌👌👌'))
  .catch((err) => console.log(err));

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

//------------ Model Configure ------------//
const Blog = require('./models/Blog');

//------------ Blog API ------------//
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().lean();
    return res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} || ${process.env.CLIENT_URL}`);
});
