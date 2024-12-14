import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, SECRET_JWT_KEY } from "../config.js";
import { TYPE_ERROR } from "../utils/handleErrors.js";

export const verifyCookies = (req, res, next) => {
  const { [ACCESS_TOKEN]: token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: TYPE_ERROR.ACCESS_NOT_AUTHORIZED });
  }

  try {
    jwt.verify(token, SECRET_JWT_KEY);

    next();
  } catch (error) {
    return res.status(401).json({ message: TYPE_ERROR.ACCESS_NOT_AUTHORIZED });
  }
};
