import { Router } from "express";
import pk from '../package.json' with { type: 'json' }
import { createAuthRouter } from "./auth.js";

export const createRouter = ({ models }) => {
  const router = Router();

  router.get("/", (req, res) => {
    return res.json({
      name: pk.name,
      version: pk.version,
      license: pk.license,
      author: pk.author,
    });
  });

  router.use("/", createAuthRouter({ userModel: models.userModel }));

  return router;
};
