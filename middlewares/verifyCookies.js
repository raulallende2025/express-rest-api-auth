import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, SECRET_JWT_KEY } from "../config.js";
import { MESSAGE } from "../utils/constants.js";

export const verifyCookies = (req, res, next) => {
  const { [ACCESS_TOKEN]: token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: MESSAGE.ERROR.UNAUTHORIZED });
  }

  try {
    jwt.verify(token, SECRET_JWT_KEY);

    next();
  } catch (error) {
    return res.status(401).json({ message: MESSAGE.ERROR.UNAUTHORIZED });
  }
};
