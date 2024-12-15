import passwordHash from "password-hash";
import mysql from "mysql2/promise";
import {
  ConnectionError,
  QueryError,
  ValidationError,
} from "../../utils/errors.js";
import { createAccessToken } from "../../utils/createToken.js";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../../config.js";
import { MESSAGE } from "../../utils/constants.js";
import { QUERY } from "./queries/mysql.js";

const config = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

async function excecuteQuery({ text, values, queryError }) {
  let connection = null;

  try {
    connection = await mysql.createConnection(config);
  } catch (error) {
    throw new ConnectionError(MESSAGE.ERROR.DATABASE_CONNECTION);
  }

  let result = null;

  try {
    if (values && values.length) result = await connection.query(text, values);
    else result = await connection.query(text);
  } catch (error) {
    throw new QueryError(queryError);
  } finally {
    await connection.end();
  }

  return result;
}

export class UserModel {
  static async create({ name, email, password }) {
    const user = await this.findUserByEmail({ email });
    if (user) throw new ValidationError(MESSAGE.VALIDATION.EMAIL_EXISTS);

    const newUser = { name, email };
    const hashedPassword = passwordHash.generate(password);

    const query = {
      text: QUERY.GENERATE_NEW_ID,
      values: [],
      queryError: MESSAGE.QUERY_ERROR.GENERATE_ID,
    };

    const [uuidResult] = await excecuteQuery(query);
    const [{ uuid }] = uuidResult;
    newUser.id = uuid;

    query.text = QUERY.USER.INSERT;
    query.values = [uuid, name, email, hashedPassword];
    query.queryError = MESSAGE.QUERY_ERROR.CREATE_USER;

    await excecuteQuery(query);

    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async login({ email, password }) {
    const user = await this.findUserByEmail({ email });
    if (!user) throw new ValidationError(MESSAGE.VALIDATION.USER_NOT_FOUND);

    const isValid = passwordHash.verify(password, user.password);
    if (!isValid)
      throw new ValidationError(MESSAGE.VALIDATION.INVALID_CREDENTIAL);

    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async findUserByEmail({ email }) {
    const query = {
      text: QUERY.USER.FIND_BY_EMAIL,
      values: [email],
      queryError: MESSAGE.QUERY_ERROR.FIND_USER_BY_EMAIL,
    };

    const [result] = await excecuteQuery(query);

    if (!result.length) return null;

    return { ...result[0] };
  }
}
