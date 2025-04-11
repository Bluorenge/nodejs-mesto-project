import { ErrorRequestHandler } from 'express';

import StatusCode from '../constants/status-codes';

const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  const message = statusCode !== StatusCode.INTERNAL_SERVER_ERROR
    ? err.message
    : 'На сервере произошла ошибка';

  res.status(statusCode).send({ message, status: statusCode });
};

export default errorHandler;
