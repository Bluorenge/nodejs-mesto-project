import StatusCode from '../constants/status-codes';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
