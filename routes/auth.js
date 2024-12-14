import { Router } from "express";
import { AuthController } from "../controllers/auth.js";

export const createAuthRouter = ({ userModel }) => {
  const router = Router();
  const authController = new AuthController({ userModel });

  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.get("/logout", authController.logout);

  return router;
};
