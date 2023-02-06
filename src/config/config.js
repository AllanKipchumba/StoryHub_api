// Set up environment variables
require("dotenv").config();

module.exports = {
  dev_port: process.env.DEVELOPMENT_PORT,
  prod_port: process.env.PORT,
  mongoDB_url_prod: process.env.MONGODB_URL,
  mongoDB_url_local: process.env.MONGODB_URL_LOCAL,
  mongoDB_url_local_test: process.env.MONGODB_URL_LOCAL_TEST,
  jwt_secret: process.env.JWT_SECRET,
  auth_user: process.env.AUTH_USER,
  auth_pass: process.env.AUTH_PASS,
};
