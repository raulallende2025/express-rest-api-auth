import { UserModel } from "./models/db-local/user.js";
import { createServer } from "./utils/createServer.js";

const models = {
  userModel: UserModel,
};

createServer({ models });
