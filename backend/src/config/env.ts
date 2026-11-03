import dotenv from "dotenv";

dotenv.config();

function parseClientOrigins(value: string | undefined): string[] {
  if (!value) return [];

  return [
    ...new Set(
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map((origin) => {
          let parsed: URL;

          try {
            parsed = new URL(origin);
          } catch {
            throw new Error(
              "CLIENT_URL must contain valid HTTP or HTTPS origins.",
            );
          }

          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            throw new Error(
              "CLIENT_URL must contain valid HTTP or HTTPS origins.",
            );
          }

          return parsed.origin;
        }),
    ),
  ];
}

const configuredPort = process.env.PORT ? Number(process.env.PORT) : 5000;

if (
  !Number.isInteger(configuredPort) ||
  configuredPort < 1 ||
  configuredPort > 65535
) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is missing.`);
  }

  return value;
}

export const env = {
  PORT: configuredPort,

  DATABASE_URL: getEnv("DATABASE_URL"),

  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  NODE_ENV: process.env.NODE_ENV || "development",

  clientOrigins: parseClientOrigins(process.env.CLIENT_URL),

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
