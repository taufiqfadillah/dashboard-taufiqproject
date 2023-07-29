const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

const User = mongoose.model('Users', UserSchema);

module.exports = User;
