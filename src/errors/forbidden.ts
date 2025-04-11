import StatusCode from '../constants/status-codes';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.BAD_REQUEST;
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
