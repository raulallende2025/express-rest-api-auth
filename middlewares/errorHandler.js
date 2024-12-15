import { ERROR_TYPE, MESSAGE } from "../utils/constants.js";
import {
  ConnectionError,
  QueryError,
  ValidationError,
} from "../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError)
    return res
      .status(400)
      .json({ name: err.name, message: err.message, detail: err.detail });

  if (err instanceof ConnectionError)
    return res.status(501).json({ name: err.name, message: err.message });

  if (err instanceof QueryError)
    return res.status(503).json({ name: err.name, message: err.message });

  console.log(err);
  return res
    .status(500)
    .json({ name: ERROR_TYPE.INTERNAL, message: MESSAGE.ERROR.INTERNAL_ERROR });
};
