/**
 * Module for connecting to the MongoDB database.
 *
 * @module
 */

const mongoose = require('mongoose');
const config = require('../config/db.conf').mongodbConfig;

/**
 * Function for connecting to the MongoDB database.
 *
 * @async
 * @function
 * @returns {Promise<mongoose.Connection>} Returns a promise that resolves to a connection object if the connection is successful.
 * @throws {Error} Throws an error if the connection to the database fails.
 */
const connectToMongoDB = async () => {
  const connection = await mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection;
};

module.exports = { connectToMongoDB };
