/* eslint-disable max-classes-per-file */
const httpStatus = require('http-status');

interface ExtendableError {
  status: string;
  isPublic: string;
}

/**
 * @extends Error
 * @implements ExtendableError
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic, error) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    if (error) {
      this.stack = `${this.stack} \nCaused by:\n ${error.stack}`;
    }
  }
}

/**
 * Class representing an API error
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false, error) {
    super(message, status, isPublic, error);
  }
}

export default APIError;
