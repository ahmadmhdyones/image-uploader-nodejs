const mongoose = require('mongoose');
const config = require('../config/db.conf').mongodbConfig;

const connectToMongoDB = async () => {
  const connection = await mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection;
};

module.exports = { connectToMongoDB };
