import dotenv from "dotenv";
dotenv.config();

const env = {
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  // Auth

  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
  AUTH_ACCESS_TOKEN_TTL: Number(process.env.AUTH_ACCESS_TOKEN_TTL) || 3600,
  AUTH_REFRESHTOKEN_TTL: Number(process.env.AUTH_REFRESHTOKEN_TTL) || 7,
};

export default env;
