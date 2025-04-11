import StatusCode from '../constants/status-codes';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

export default BadRequestError;
