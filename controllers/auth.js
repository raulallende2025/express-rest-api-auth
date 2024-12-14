import { validatePartialUser, validateUser } from "../schemas/user.js";
import { TYPE_ERROR, ValidationError } from "../utils/handleErrors.js";
import { ACCESS_TOKEN } from "../config.js";

export class AuthController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const { error, data } = validateUser(req.body);

    if (error)
      return res.status(400).json({
        message: TYPE_ERROR.BAD_REQUEST,
        error: JSON.parse(error.message),
      });

    try {
      const { user, token } = await this.userModel.create({ ...data });
      this.sendCookies(res, token, user);
    } catch (err) {
      if (err instanceof ValidationError)
        return res.status(400).json({ message: err.message });

      return res.status(500).json({ message: TYPE_ERROR.INTERNAL_ERROR });
    }
  };

  login = async (req, res) => {
    const { error, data } = validatePartialUser(req.body);

    if (error)
      return res.status(400).json({
        message: TYPE_ERROR.BAD_REQUEST,
        error: JSON.parse(error.message),
      });

    try {
      const { user, token } = await this.userModel.login({ ...data });
      this.sendCookies(res, token, user);
    } catch (err) {
      if (err instanceof ValidationError)
        return res.status(400).json({ message: err.message });

      return res.status(500).json({ message: TYPE_ERROR.INTERNAL_ERROR });
    }
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
