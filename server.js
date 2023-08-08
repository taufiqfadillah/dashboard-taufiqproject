const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');

const app = express();

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const { MongoURI } = require('./config/key');

//------------ Mongo Connection ------------//
async function connectToDatabase() {
  try {
    await mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('Successfully connected to MongoDB👌👌👌');
  } catch (error) {
    console.error(error);
  }
}
connectToDatabase();

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }));

//------------ Express session Configuration ------------//
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

//------------ Error Handling ------------//
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;

//------------ Server Listen ------------//
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
