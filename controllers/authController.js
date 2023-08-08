const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.JWT_KEY;
const JWT_RESET_KEY = process.env.JWT_RESET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;

//------------ User Model ------------//
const User = require('../models/User');

//------------ Register Handle ------------//
exports.registerHandle = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.render('register', {
        errors: [{ msg: 'Email ID already registered' }],
        name,
        email,
        password,
        password2,
      });
    }

    const oauth2Client = new OAuth2(GOOGLE_ID, GOOGLE_SECRET, 'https://developers.google.com/oauthplayground');
    oauth2Client.setCredentials({
      refresh_token: GOOGLE_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();

    const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });

    const output = `
      <h2>Please click on below link to activate your account</h2>
      <p>${CLIENT_URL}/auth/activate/${token}</p>
      <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'fuungt@gmail.com',
        clientId: '451170394890-c8b2pvcdhvnaf6ev3h0oggenom8ht7el.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//046rwKWlSNwioCgYIARAAGAQSNwF-L9IrWLvpErOQ1QsiwrmPKyNIagfAklItvLjGBCu_jlDajBw40IV6AIjYCeY8PHHbZcy2umc',
        accessToken,
      },
    });

    const mailOptions = {
      from: '"Taufiq Project || Email Verification" <admin@taufiqproject.my.id>',
      to: email,
      subject: 'Account Verification: Taufiq Project ✔',
      generateTextFromHTML: true,
      html: output,
    };

    await transporter.sendMail(mailOptions);

    req.flash('success_msg', 'Activation link sent to email ID. Please activate to log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Something went wrong on our end. Please register again.');
    res.redirect('/auth/login');
  }
};

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
  const token = req.params.token;
  let errors = [];
  if (token) {
    jwt.verify(token, JWT_KEY, (err, decodedToken) => {
      if (err) {
        req.flash('error_msg', 'Incorrect or expired link! Please register again.');
        res.redirect('/auth/register');
      } else {
        const { name, email, password } = decodedToken;
        User.findOne({ email: email }).then((user) => {
          if (user) {
            //------------ User already exists ------------//
            req.flash('error_msg', 'Email ID already registered! Please log in.');
            res.redirect('/auth/login');
          } else {
            const newUser = new User({
              name,
              email,
              password,
            });

            bcryptjs.genSalt(10, (err, salt) => {
              bcryptjs.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    req.flash('success_msg', 'Account activated. You can now log in.');
                    res.redirect('/auth/login');
                  })
                  .catch((err) => console.log(err));
              });
            });
          }
        });
      }
    });
  } else {
    console.log('Account activation error!');
  }
};

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  let errors = [];

  //------------ Checking required fields ------------//
  if (!email) {
    errors.push({ msg: 'Please enter an email ID' });
  }

  if (errors.length > 0) {
    res.render('forgot', {
      errors,
      email,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        //------------ User already exists ------------//
        errors.push({ msg: 'User with Email ID does not exist!' });
        res.render('forgot', {
          errors,
          email,
        });
      } else {
        const oauth2Client = new OAuth2(GOOGLE_ID, GOOGLE_SECRET, 'https://developers.google.com/oauthplayground');

        oauth2Client.setCredentials({
          refresh_token: GOOGLE_TOKEN,
        });
        const accessToken = oauth2Client.getAccessToken();

        const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
        const CLIENT_URL = 'http://' + req.headers.host;
        const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

        User.updateOne({ resetLink: token }, (err, success) => {
          if (err) {
            errors.push({ msg: 'Error resetting password!' });
            res.render('forgot', {
              errors,
              email,
            });
          } else {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: 'fuungt@gmail.com',
                clientId: '451170394890-c8b2pvcdhvnaf6ev3h0oggenom8ht7el.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//046rwKWlSNwioCgYIARAAGAQSNwF-L9IrWLvpErOQ1QsiwrmPKyNIagfAklItvLjGBCu_jlDajBw40IV6AIjYCeY8PHHbZcy2umc',
                accessToken: accessToken,
              },
            });

            // send mail with defined transport object
            const mailOptions = {
              from: '"Taufiq Project || Reset Password" <admin@taufiqproject.my.id>', // sender address
              to: email, // list of receivers
              subject: 'Account Password Reset: Taufiq Project ✔', // Subject line
              html: output, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                req.flash('error_msg', 'Something went wrong on our end. Please try again later.');
                res.redirect('/auth/forgot');
              } else {
                console.log('Mail sent : %s', info.response);
                req.flash('success_msg', 'Password reset link sent to email ID. Please follow the instructions.');
                res.redirect('/auth/login');
              }
            });
          }
        });
      }
    });
  }
};

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
  const { token } = req.params;

  if (token) {
    jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
      if (err) {
        req.flash('error_msg', 'Incorrect or expired link! Please try again.');
        res.redirect('/auth/login');
      } else {
        const { _id } = decodedToken;
        User.findById(_id, (err, user) => {
          if (err) {
            req.flash('error_msg', 'User with email ID does not exist! Please try again.');
            res.redirect('/auth/login');
          } else {
            res.redirect(`/auth/reset/${_id}`);
          }
        });
      }
    });
  } else {
    console.log('Password reset error!');
  }
};

exports.resetPassword = (req, res) => {
  var { password, password2 } = req.body;
  const id = req.params.id;
  let errors = [];

  //------------ Checking required fields ------------//
  if (!password || !password2) {
    req.flash('error_msg', 'Please enter all fields.');
    res.redirect(`/auth/reset/${id}`);
  }

  //------------ Checking password length ------------//
  else if (password.length < 8) {
    req.flash('error_msg', 'Password must be at least 8 characters.');
    res.redirect(`/auth/reset/${id}`);
  }

  //------------ Checking password mismatch ------------//
  else if (password != password2) {
    req.flash('error_msg', 'Passwords do not match.');
    res.redirect(`/auth/reset/${id}`);
  } else {
    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(password, salt, (err, hash) => {
        if (err) throw err;
        password = hash;

        User.findByIdAndUpdate({ _id: id }, { password }, function (err, result) {
          if (err) {
            req.flash('error_msg', 'Error resetting password!');
            res.redirect(`/auth/reset/${id}`);
          } else {
            req.flash('success_msg', 'Password reset successfully!');
            res.redirect('/auth/login');
          }
        });
      });
    });
  }
};

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: 'https://dashboard.taufiqproject.my.id/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
};

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
};

//------------ Google Login Handle ------------//
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'https://sso.taufiqproject.my.id/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // Pengguna sudah terdaftar, lanjutkan dengan autentikasi
          return cb(null, existingUser);
        } else {
          // Buat pengguna baru dari data profil Google
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            verified: true, // Sesuaikan dengan kebutuhan Anda
            googleId: profile.id,
          });

          await newUser.save(); // Simpan pengguna baru ke dalam basis data
          return cb(null, newUser);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
