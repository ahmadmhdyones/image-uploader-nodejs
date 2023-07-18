/* eslint-disable no-process-exit */
/* eslint-disable no-console */

require('dotenv').config();

const app = require('./app/app');
const config = require('./app/config/srv.conf');
const { connectToMongoDB } = require('./app/database/Mongo.database');

let server = null;

process.on('unhandledException', (err) => {
  console.error(`🥊 ${'Error!'.bold} ${err.name}`.red.inverse, '\n', err);
  console.log(`💥 ${'UNHANDLED EXCEPTION!'.bold} Shutting down...`.yellow);
  server.close(() => process.exit(1));
});

const init = async () => {
  const { connection } = await connectToMongoDB();
  console.log(
    `✅ ${'Success!'.bold} DB connection successful with host ${
      connection.host.underline
    }`.green.inverse
  );

  server = app.listen(config.port, () => {
    console.log(
      `🚀 ${'Server running!'.bold} in ${
        process.env.NODE_ENV.underline
      } on port ${config.port.underline}...`.yellow.inverse
    );
  });

  const timeout = Number(config.timeout);
  server.setTimeout(timeout);
};

init();

process.on('unhandledRejection', (err) => {
  console.error(`🥊 ${'Error!'.bold} ${err.name}`.red.inverse, '\n', err);
  console.log(`💥 ${'UNHANDLED REJECTION!'.bold} Shutting down...`.yellow);
  server.close(() => process.exit(1));
});
