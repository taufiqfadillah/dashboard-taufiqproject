const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: String,
  status: { type: String, default: 'In Progress' },
  date: { type: Date, default: Date.now },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
