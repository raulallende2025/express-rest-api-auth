import passwordHash from "password-hash";
import pg from "pg";
import { ConnectionError, ValidationError } from "../../utils/errors.js";
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

const { Client } = pg;

async function excecuteQuery(query) {
  const client = new Client(config);

  try {
    await client.connect();
  } catch (error) {
    throw new ConnectionError("error connecting to database");
  }

  let result = null;

  try {
    if (query.values && query.values.length) result = await client.query(query);
    else result = await client.query(query);
  } catch (error) {
    throw new QueryError(query.queryError);
  } finally {
    await client.end();
  }

  return result;
}

export class UserModel {
  static async create({ name, email, password }) {
    const [user] = await this.findUserByEmail({ email });
    if (user) throw new ValidationError("email already exists");

    const newUser = { name, email };
    const hashedPassword = passwordHash.generate(password);

    const query = {
      text: "SELECT gen_random_uuid() id",
      values: [],
      queryError: "error getting a new id",
    };
    const { rows } = await excecuteQuery(query);
    const [{ id }] = rows;
    newUser.id = id;

    query.text =
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)";
    query.values = [id, name, email, hashedPassword];
    query.queryError = "error creating a new user";
    await excecuteQuery(query);

    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async login({ email, password }) {
    const [user] = await this.findUserByEmail({ email });
    if (!user) throw new ValidationError("user does not exists");

    const isValid = passwordHash.verify(password, user.password);
    if (!isValid) throw new ValidationError("user or password incorrect");

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
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
      queryError: "error getting user by email",
    };
    const { rows } = await excecuteQuery(query);
    return rows;
  }
}
