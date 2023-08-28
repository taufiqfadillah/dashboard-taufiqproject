const { createClient } = require('redis');
require('dotenv').config();

const redisConfig = {
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient
  .connect()
  .then(() => {
    console.log('Successfully connected to Redis🚀🚀🚀');
  })
  .catch((err) => {
    console.error('Redis Connection Error', err);
  });

module.exports = redisClient;
