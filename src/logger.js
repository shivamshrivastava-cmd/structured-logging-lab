const SERVICE_NAME = 'orders-api';

const serializeError = (error) => ({
  errorName: error.name,
  errorMessage: error.message,
  ...(error.code ? { errorCode: error.code } : {}),
});

const createLogger = (context = {}) => {
  const write = (level, msg, fields = {}) => {
    const { err, ...otherFields } = fields;
    const safeFields = err instanceof Error
      ? { ...otherFields, ...serializeError(err) }
      : otherFields;
    process.stdout.write(`${JSON.stringify({
      ts: new Date().toISOString(),
      level,
      service: SERVICE_NAME,
      msg,
      ...context,
      ...safeFields,
    })}\n`);
  };

  return {
    child: (fields) => createLogger({ ...context, ...fields }),
    info: (msg, fields) => write('info', msg, fields),
    warn: (msg, fields) => write('warn', msg, fields),
    error: (msg, fields) => write('error', msg, fields),
  };
};

module.exports = { logger: createLogger() };
