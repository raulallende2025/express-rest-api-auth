export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DBConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "DBConnectionError";
  }
}

export class DBQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = "DBQueryError";
  }
}

export const TYPE_ERROR = {
  ACCESS_NOT_AUTHORIZED: "Access not authorized",
  EMPTY_STRING: "Must have at least 1 character",
  EMAIL_INVALID: "Must be a valid email",
  EMAIL_EXISTS: "The email already exists",
  PASSWORD_INVALID: "Your password is not valid",
  USER_NOT_EXISTS: "The user does not exist",
  USER_PASSWORD_INCORRECT: "User or password incorrect",
  BAD_REQUEST: "404 bad request",
  INTERNAL_ERROR: "Internal error :(",
  DB_CONNECTION_ERROR: "Error connecting to database",
  DB_QUERY_GET_NEW_UUID: "Error getting a new id",
  DB_QUERY_CREATE_NEW_USER: "Error creating a new user",
  DB_QUERY_FIND_USER_BY_EMAIL: "Error finding user by email",
};
