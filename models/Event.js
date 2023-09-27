const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  presenter: String,
  status: String,
  location: String,
  type: String,
  capacity: Number,
  department: String,
  startTime: String,
  endTime: String,
  introduction: String,
  date: String,
  image: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
