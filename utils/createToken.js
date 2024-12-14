import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY, JWT_EXPIRED_IN } from "../config.js";

export const createAccessToken = (data) => {
  return jwt.sign(data, SECRET_JWT_KEY, {
    expiresIn: JWT_EXPIRED_IN,
  });
};
