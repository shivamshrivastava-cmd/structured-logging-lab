const express = require('express');
const router = express.Router();
const { queryDb } = require('../db');

router.get('/', async (req, res) => {
  req.log.info('orders.list.start');
  try {
    const result = await queryDb('SELECT * FROM orders', [], req.log);
    req.log.info('orders.list.complete', { orderCount: result.rowCount });
    res.json(result.rows);
  } catch (err) {
    req.log.error('orders.list.failed', { err });
    res.status(500).send('Error fetching orders');
  }
});

router.post('/', async (req, res) => {
  const { product_id, quantity, customer_id } = req.body;
  req.log.info('orders.create.start', { productId: product_id, customerId: customer_id });

  if (!product_id || !quantity || !customer_id) {
    req.log.warn('orders.create.invalid_request', { missingFields: true });
    return res.status(400).send('Missing fields');
  }

  try {
    const result = await queryDb(
      'INSERT INTO orders (product_id, quantity, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, customer_id],
      req.log,
    );
    req.log.info('orders.create.complete', { orderId: result.rows[0].id });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log.error('orders.create.failed', { err });
    res.status(500).send('Error creating order');
  }
});

module.exports = router;
