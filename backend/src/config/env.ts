import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is missing.`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: getEnv("DATABASE_URL"),

  JWT_SECRET: getEnv("JWT_SECRET"),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",

  NODE_ENV: process.env.NODE_ENV || "development",

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};