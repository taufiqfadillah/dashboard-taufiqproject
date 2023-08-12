const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'user.png',
    },
    website: {
      type: String,
      default: 'https://www.taufiqproject.my.id/',
    },
    instagram: {
      type: String,
      default: 'https://www.instagram.com/',
    },
    twitter: {
      type: String,
      default: 'https://www.twitter.com/',
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/',
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/',
    },
    bio: {
      type: String,
      default: '',
    },
    aboutme: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Blogger',
    },
    university: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    contact: {
      type: String,
      default: '',
    },
    bod: {
      type: String,
      default: '',
    },
    hobby: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'Beginner',
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
