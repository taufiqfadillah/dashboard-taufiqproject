const redis = require('redis');

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const redisConnection = async () => {
  try {
    await redisClient.connect();
    console.log('Redis Client successfully connected🫡🫡🫡');
  } catch (error) {
    console.error(`Redis connection error. Error message: ${error.message}`);
  }
};

module.exports = { redisConnection, redisClient };
