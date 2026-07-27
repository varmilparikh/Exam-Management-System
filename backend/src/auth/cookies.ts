import type { Response } from "express";

import { env } from "../config/env.js";
import { AUTH_COOKIES, COOKIE_MAX_AGE } from "./constants.js";

const commonCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
    ...commonCookieOptions,
    maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN, // 15 minutes
  });

  res.cookie(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
    ...commonCookieOptions,
    maxAge: COOKIE_MAX_AGE.REFRESH_TOKEN, // 7 days
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
    ...commonCookieOptions,
    maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN, commonCookieOptions);

  res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, commonCookieOptions);
}
