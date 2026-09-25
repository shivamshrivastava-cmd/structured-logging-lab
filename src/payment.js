const processPayment = (log) => {
  log.info('payment.processing.start');
  // Simulate asynchronous payment processing without logging payment details.
  setTimeout(() => {
    log.info('payment.processing.complete');
  }, 500);
};

module.exports = { processPayment };
