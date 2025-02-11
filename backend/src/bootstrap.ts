import dotenv from "dotenv";
import path from "path";

const pathEnv = "../env";

const loadEnv = () => {
  if (process.env.NODE_ENV === "coolify") {
    dotenv.config();
    return;
  }
  dotenv.config({
    path: path.resolve(__dirname, pathEnv)
  });
};

loadEnv();
