import dotenv from "dotenv";

dotenv.config();

export const EnvConfig = {
  host: process.env.APP_HOST || "localhost",
  port: process.env.APP_PORT || 3000,
  origins: process.env.APP_ORIGINS || "http://localhost",
  mongoUri: process.env.APP_MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refreshsecret",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: Number(process.env.REDIS_PORT || 6379),
};
