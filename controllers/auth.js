import { validatePartialUser, validateUser } from "../schemas/user.js";
import { ValidationError } from "../utils/errors.js";
import { ACCESS_TOKEN } from "../config.js";

export class AuthController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const { error, data } = validateUser(req.body);
    if (error)
      throw new ValidationError("Invalid data", JSON.parse(error.message));

    const { user, token } = await this.userModel.create({ ...data });
    this.sendCookies(res, token, user);
  };

  login = async (req, res, next) => {
    const { error, data } = validatePartialUser(req.body);

    if (error)
      throw new ValidationError("Invalid data", JSON.parse(error.message));

    const { user, token } = await this.userModel.login({ ...data });
    this.sendCookies(res, token, user);
  };

  logout = async (req, res) => {
    return res.clearCookie(ACCESS_TOKEN).end();
  };

  sendCookies = (res, token, user) => {
    return res
      .cookie(ACCESS_TOKEN, token, {
        httpOnly: true, // acceso solo desde servidor
        secure: process.env.NODE_ENV === "production", // https solo en produccion
        sameSite: "strict", // acceso solo desde mismo dominio
        maxAge: 1000 * 60 * 60, // validez 1h
      })
      .json(user);
  };
}
