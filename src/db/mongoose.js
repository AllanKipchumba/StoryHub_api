//import configuration
const config = require("../config/config");
const mongoose = require("mongoose");

//create db connection
const mongodb_uri = config.mongoDB_url_prod;
// const mongodb_uri = config.mongoDB_url_local_test;
mongoose.connect(`${mongodb_uri}`, {
  useNewUrlParser: true,
});
