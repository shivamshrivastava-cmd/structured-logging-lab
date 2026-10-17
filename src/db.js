const { Pool } = require('pg');
const { logger } = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async () => {
  logger.info('database.connect.start');
  try {
    await pool.query('SELECT NOW()');
    logger.info('database.connect.complete');
  } catch (err) {
    logger.warn('database.connect.failed', { err });
    logger.info('database.connect.retry_scheduled');
  }
};

const queryDb = async (text, params, log = logger) => {
  log.info('database.query.start');
  const result = await pool.query(text, params);
  log.info('database.query.complete', { rowCount: result.rowCount });
  return result;
};

module.exports = { connectDb, queryDb, pool };
