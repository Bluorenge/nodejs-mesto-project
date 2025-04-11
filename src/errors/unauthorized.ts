import StatusCode from '../constants/status-codes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.BAD_REQUEST;
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
