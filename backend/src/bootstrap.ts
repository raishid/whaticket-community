import dotenv from "dotenv";

let pathEnv = ".env";

if (process.env.NODE_ENV === "test") {
  pathEnv = ".env.test";
}

if (process.env.NODE_ENV === "coolify") {
  pathEnv = "../../.env";
}

if (process.env.NDOE_ENV === "development") {
  pathEnv = ".env.development";
}
dotenv.config({
  path: pathEnv
});
