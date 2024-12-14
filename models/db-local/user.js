import { randomUUID } from "node:crypto";
import passwordHash from "password-hash";
import DBLocal from "db-local";
import { TYPE_ERROR, ValidationError } from "../../utils/handleErrors.js";
import { createAccessToken } from "../../utils/createToken.js";

const { Schema } = new DBLocal({ path: "./db" });
const User = Schema("User", {
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserModel {
  static async create({ name, email, password }) {
    const user = await this.findUserByEmail({ email });

    if (user) throw new ValidationError(TYPE_ERROR.EMAIL_EXISTS);

    const id = randomUUID();
    const hashedPassword = passwordHash.generate(password);

    User.create({ _id: id, name, email, password: hashedPassword }).save();

    const newUser = { id, name, email };
    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async login({ email, password }) {
    const user = await this.findUserByEmail({ email });
    if (!user) throw new ValidationError(TYPE_ERROR.USER_NOT_EXISTS);

    const isValid = passwordHash.verify(password, user.password);
    if (!isValid) throw new ValidationError(TYPE_ERROR.USER_PASSWORD_INCORRECT);

    const newUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = createAccessToken(newUser);

    return { user: newUser, token };
  }

  static async findUserByEmail({ email }) {
    return await User.findOne({ email });
  }
}
