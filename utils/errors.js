import { ERROR_TYPE } from "./constants.js";

export class ValidationError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = ERROR_TYPE.VALIDATION;
    this.detail = detail;
  }
}
export class ConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPE.CONNECTION;
  }
}
export class QueryError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPE.QUERY;
  }
}
export class InternalError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPE.INTERNAL;
  }
}
