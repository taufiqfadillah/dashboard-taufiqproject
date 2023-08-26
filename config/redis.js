const createClient = require('redis');

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on('connect', () => {
  console.log('Client connected to redis...');
});

redisClient.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

redisClient.on('error', (err) => {
  console.log(err.message);
});

redisClient.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  redisClient.quit();
});

module.exports = redisClient;
