require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MongoURI: MONGODB_URI,
};
