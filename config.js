import "dotenv/config";

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = "secret-jwt-key",
  JWT_EXPIRED_IN = "1h",
  ACCESS_TOKEN = "access_token",
  DB_HOST = "localhost",
  DB_PORT = 3306,
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "db",
} = process.env;
