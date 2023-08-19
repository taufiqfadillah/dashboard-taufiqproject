const mongoose = require('mongoose');
const slugify = require('slugify');
const { format } = require('date-fns');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
