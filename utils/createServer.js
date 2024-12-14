import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "../config.js";
import { createRouter } from "../routes/index.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createServer = ({ models }) => {
  const app = express();

  app.disable("x-powered-by");

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.use("/", createRouter({ models }));

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });

  return app;
};
