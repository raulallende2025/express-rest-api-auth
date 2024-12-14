import { ConnectionError, ValidationError } from "../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError)
    return res
      .status(400)
      .json({ name: err.name, message: err.message, detail: err.detail });

  if (err instanceof ConnectionError)
    return res.status(501).json({ name: err.name, message: err.message });

  console.log(err);
  return res
    .status(500)
    .json({ name: "InternalError", message: "Internal server error" });
};
