/**
 * Configuration object for the databases connections.
 *
 * @typedef {Object}
 * @property {string} connectionString - The connection string for the MongoDB database.
 */

const mongodbConfig = {
  connectionString:
    process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017',
};

module.exports = {
  mongodbConfig,
};
