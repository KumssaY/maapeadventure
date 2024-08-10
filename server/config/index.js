require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  baseUrl: process.env.BASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  exposedURL: process.env.EXPOSED_URL
};
