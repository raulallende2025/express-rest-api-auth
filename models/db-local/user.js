import { randomUUID } from "node:crypto";
import passwordHash from "password-hash";
import DBLocal from "db-local";
import { ValidationError } from "../../utils/errors.js";
import { createAccessToken } from "../../utils/createToken.js";
import { MESSAGE } from "../../utils/constants.js";

const { Schema } = new DBLocal({ path: "./models/db-local/db" });
const User = Schema("User", {
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserModel {
  static async create({ name, email, password }) {
    const user = await this.findUserByEmail({ email });

    if (user) throw new ValidationError(MESSAGE.VALIDATION.EMAIL_EXISTS);

    const id = randomUUID();
    const hashedPassword = passwordHash.generate(password);

    User.create({ _id: id, name, email, password: hashedPassword }).save();

    const newUser = { id, name, email };
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
