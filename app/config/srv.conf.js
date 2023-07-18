/**
 * Configuration object for the server.
 *
 * @typedef {Object}
 * @property {number} port - The port number that the server should listen on.
 * @property {number} timeout - The server timeout value in milliseconds.
 */

module.exports = {
  port: process.env.PORT || 8000,
  timeout: process.env.TIMEOUT || 10000,
};
