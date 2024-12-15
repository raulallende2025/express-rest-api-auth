import z from "zod";
import { REGEX } from "../utils/constants.js";
import { MESSAGE } from "../utils/constants.js";

const userSchema = z.object({
  name: z.string().min(1, { message: MESSAGE.VALIDATION.REQUIRED_FIELD }),
  email: z
    .string()
    .min(1, { message: MESSAGE.VALIDATION.REQUIRED_FIELD })
    .email({
      message: MESSAGE.VALIDATION.INVALID_EMAIL,
    }),
  password: z
    .string()
    .min(1, { message: MESSAGE.VALIDATION.REQUIRED_FIELD })
    .regex(REGEX.PASSWORD, {
      message: MESSAGE.VALIDATION.INVALID_PASSWORD,
    }),
});

export function validateUser(input) {
  return userSchema.safeParse(input);
}
export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}
