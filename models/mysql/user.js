import passwordHash from "password-hash";
import mysql from "mysql2/promise";
import {
  DBConnectionError,
  DBQueryError,
  ValidationError,
  TYPE_ERROR,
} from "../../utils/handleErrors.js";
import { createAccessToken } from "../../utils/createToken.js";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../../config.js";

const config = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

let connection = null;

try {
  connection = await mysql.createConnection(config);
} catch (error) {
  throw new DBConnectionError(TYPE_ERROR.DB_CONNECTION_ERROR);
}

export class UserModel {
  static async create({ name, email, password }) {
    const user = await this.findUserByEmail({ email });
    if (user) throw new ValidationError(TYPE_ERROR.EMAIL_EXISTS);

    const newUser = { name, email };
    const hashedPassword = passwordHash.generate(password);

    try {
      const [uuidResult] = await connection.query("SELECT UUID() uuid;");
      const [{ uuid }] = uuidResult;
      newUser.id = uuid;
    } catch (error) {
      throw new DBQueryError(TYPE_ERROR.DB_QUERY_GET_NEW_UUID);
    }

    try {
      await connection.query(
        `INSERT INTO users (id, name, email, password) VALUES (UUID_TO_BIN("${newUser.id}"), ?, ?, ?);`,
        [name, email, hashedPassword]
      );
    } catch (error) {
      throw new DBQueryError(TYPE_ERROR.DB_QUERY_CREATE_NEW_USER);
    }

    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async login({ email, password }) {
    const user = await this.findUserByEmail({ email });
    if (!user) throw new ValidationError(TYPE_ERROR.USER_NOT_EXISTS);

    const isValid = passwordHash.verify(password, user.password);
    if (!isValid) throw new ValidationError(TYPE_ERROR.USER_PASSWORD_INCORRECT);

    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async findUserByEmail({ email }) {
    try {
      const [result] = await connection.query(
        "SELECT BIN_TO_UUID(id) id, name, email FROM users WHERE email = ?;",
        [email]
      );

      if (!result.length) return null;

      return { ...result[0] };
    } catch (error) {
      throw new DBQueryError(TYPE_ERROR.DB_QUERY_FIND_USER_BY_EMAIL);
    }
  }
}
