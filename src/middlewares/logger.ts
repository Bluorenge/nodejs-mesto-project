import winston from 'winston';
import expressWinston from 'express-winston';

import 'winston-daily-rotate-file';

const requestTransport = new winston.transports.DailyRotateFile({
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});

export const requestLogger = expressWinston.logger({
  transports: [
    requestTransport,
  ],
  format: winston.format.json(),
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});

// логер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    errorTransport,
  ],
  format: winston.format.json(),
});
