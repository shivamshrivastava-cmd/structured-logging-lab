const crypto = require('crypto');
const express = require('express');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { logger } = require('./logger');
const { processPayment } = require('./payment');

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  req.log = logger.child({ reqId: req.id });
  const startedAt = Date.now();

  req.log.info('request.start', { method: req.method, path: req.path });
  res.on('finish', () => {
    req.log.info('request.complete', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });
  next();
});

logger.info('service.starting', { port });
connectDb();

app.get('/', (req, res) => {
  req.log.info('health.check');
  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  req.log.info('payment.start');
  processPayment(req.log);
  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  const err = new Error('Simulated failure');
  req.log.error('request.simulated_failure', { err });
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  logger.info('service.listening', { port });
});
