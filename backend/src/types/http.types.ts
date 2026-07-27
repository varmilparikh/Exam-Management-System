import type { Request } from "express";

/**
 * Standard request
 */
export type HttpRequest = Request;

/**
 * Request with typed body
 */
export type BodyRequest<T> = Request<Record<string, string>, unknown, T>;

/**
 * Request with typed params
 */
export type ParamsRequest<P> = Request<P, unknown, unknown>;

/**
 * Request with typed params + body
 */
export type ParamsBodyRequest<P, B> = Request<P, unknown, B>;

/**
 * Request with authenticated user
 */
export type AuthenticatedRequest = Request;

/**
 * Authenticated request with typed body
 */
export type AuthenticatedBodyRequest<T> = Request<
  Record<string, string>,
  unknown,
  T
>;

/**
 * Authenticated request with typed params
 */
export type AuthenticatedParamsRequest<P> = Request<P, unknown, unknown>;

/**
 * Authenticated request with typed params + body
 */
export type AuthenticatedParamsBodyRequest<P, B> = Request<P, unknown, B>;
