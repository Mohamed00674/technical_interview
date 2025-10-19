import dotenv from "dotenv";

dotenv.config();

export const EnvConfig = {
  host: process.env.APP_HOST || "localhost",
  port: process.env.APP_PORT || 3000,
  origins: process.env.APP_ORIGINS || "http://localhost",
  mongoUri: process.env.APP_MONGO_URI || "",
 
};
