import express from 'express';

import mongoose from 'mongoose';
import { errors } from 'celebrate';

import routes from './routes';
import errorHandler from './middlewares/error-handler';
import limiter from './middlewares/limiter';
import { requestLogger, errorLogger } from './middlewares/logger';
import { DEFAULT_PORT, DEFAULT_MONGO_URL } from './config';

const { PORT = DEFAULT_PORT, MONGO_URL = DEFAULT_MONGO_URL } = process.env;

const app = express();

// подключаемся к серверу MongoDB
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(limiter);
app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
