export const REGEX = {
  PASSWORD: new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
};

export const ERROR_TYPE = {
  VALIDATION: "ValidationError",
  CONNECTION: "ConnectionError",
  QUERY: "QueryError",
  INTERNAL: "InternalError",
};

export const MESSAGE = {
  ERROR: {
    INTERNAL_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized access",
    DATABASE_CONNECTION: "Error connecting to database",
  },
  VALIDATION: {
    INVALID_DATA: "Invalid data",
    EMAIL_EXISTS: "Email already exists",
    INVALID_EMAIL: "Must be a valid email",
    INVALID_PASSWORD: "Must be a valid password",
    INVALID_CREDENTIAL: "Email or password incorrect",
    USER_NOT_FOUND: "User does not exists",
    REQUIRED_FIELD: "This field is required",
  },
  QUERY_ERROR: {
    GENERATE_ID: "Error getting a new id",
    CREATE_USER: "Error creating a new user",
    FIND_USER_BY_EMAIL: "Error getting user by email",
  },
};
