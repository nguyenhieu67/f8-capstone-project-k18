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

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5001",
};

export default env;
