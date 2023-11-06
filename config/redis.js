const { createClient } = require('redis');
require('dotenv').config();

const redisConfig = {
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  maxclients: 100,
  enable_offline_queue: false,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
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
