import z from "zod";
import { TYPE_ERROR } from "../utils/handleErrors.js";
import { passwordValidationRegex } from "../utils/regex.js";

const userSchema = z.object({
  name: z.string().min(1, { message: TYPE_ERROR.EMPTY_STRING }),
  email: z.string().min(1, { message: TYPE_ERROR.EMPTY_STRING }).email({
    message: TYPE_ERROR.EMAIL_INVALID,
  }),
  password: z
    .string()
    .min(1, { message: TYPE_ERROR.EMPTY_STRING })
    .regex(passwordValidationRegex, { message: TYPE_ERROR.PASSWORD_INVALID }),
});

export function validateUser(input) {
  return userSchema.safeParse(input);
}
export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}
