import StatusCode from '../constants/status-codes';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.BAD_REQUEST;
    this.name = 'ConflictError';
  }
}

export default ConflictError;
