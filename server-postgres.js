import { UserModel } from "./models/postgres/user.js";
import { createServer } from "./utils/createServer.js";

const models = {
  userModel: UserModel,
};

createServer({ models });
