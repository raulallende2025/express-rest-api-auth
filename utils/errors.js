export class ValidationError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = "ValidationError";
    this.detail = detail;
  }
}
export class ConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConnectionError";
  }
}
export class QueryError extends Error {
  constructor(message) {
    super(message);
    this.name = "QueryError";
  }
}
