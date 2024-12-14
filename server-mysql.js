import { UserModel } from "./models/mysql/user.js";
import { createServer } from "./utils/createServer.js";

const models = {
  userModel: UserModel,
};

createServer({ models });
