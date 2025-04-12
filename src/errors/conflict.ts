import StatusCode from '../constants/status-codes';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCode.CONFLICT;
    this.name = 'ConflictError';
  }
}

export default ConflictError;
