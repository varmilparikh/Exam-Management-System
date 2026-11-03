import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { Prisma } from "./generated/prisma/client.js";
import { errorHandler } from "./middleware/error.middleware.js";
import type { Request, Response } from "express";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
process.env.ACCESS_TOKEN_SECRET ??= "test-access-secret-at-least-32-characters";
process.env.REFRESH_TOKEN_SECRET ??=
  "test-refresh-secret-at-least-32-characters";
process.env.CLIENT_URL = "https://frontend.example.test";

const { default: app } = await import("./app.js");

let server: ReturnType<typeof app.listen> | undefined;
let baseUrl = "";

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (!server) return;

  const activeServer = server;
  await new Promise<void>((resolve, reject) => {
    activeServer.close((error) => (error ? reject(error) : resolve()));
  });
});

test("liveness endpoint responds without touching the database", async () => {
  const response = await fetch(`${baseUrl}/health/live`, {
    headers: { Connection: "close" },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "live" });
});

test("API root keeps its public success contract", async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { Connection: "close" },
  });
  const body = (await response.json()) as {
    success: boolean;
    name: string;
    version: string;
  };

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.name, "Exam Duty Management API");
  assert.ok(body.version);
});

test("configured frontend origin can make credentialed preflight requests", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://frontend.example.test",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
      Connection: "close",
    },
  });

  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://frontend.example.test",
  );
  assert.equal(
    response.headers.get("access-control-allow-credentials"),
    "true",
  );
});

test("unknown browser origins receive no cross-origin access headers", async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: {
      Origin: "https://untrusted.example.test",
      Connection: "close",
    },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("same-origin POST requests still reach the API without CORS headers", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      Origin: baseUrl,
      "Content-Type": "application/json",
      Connection: "close",
    },
    body: "{",
  });

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("malformed JSON returns a client error instead of an internal error", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Connection: "close",
    },
    body: "{",
  });
  const body = (await response.json()) as {
    success: boolean;
    statusCode: number;
  };

  assert.equal(response.status, 400);
  assert.deepEqual(body, {
    success: false,
    statusCode: 400,
    message: "Request body contains invalid JSON",
  });
});

test("login limits repeated failed attempts by client IP", async () => {
  let response: Awaited<ReturnType<typeof fetch>> | undefined;

  for (let attempt = 0; attempt < 11; attempt += 1) {
    response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Connection: "close",
      },
      body: JSON.stringify({ email: "invalid-email", password: "wrong" }),
    });
  }

  assert.equal(response?.status, 429);
  assert.ok(response?.headers.has("ratelimit"));
  assert.deepEqual(await response?.json(), {
    success: false,
    statusCode: 429,
    message: "Too many login attempts. Try again in 15 minutes.",
  });
});

test("Prisma uniqueness conflicts map to HTTP 409", () => {
  const error = new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed",
    { code: "P2002", clientVersion: "test" },
  );
  const result = invokeErrorHandler(error);

  assert.equal(result.status, 409);
  assert.deepEqual(result.body, {
    success: false,
    statusCode: 409,
    message: "A record with these details already exists",
  });
});

test("missing Prisma records map to HTTP 404", () => {
  const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
    code: "P2025",
    clientVersion: "test",
  });
  const result = invokeErrorHandler(error);

  assert.equal(result.status, 404);
  assert.deepEqual(result.body, {
    success: false,
    statusCode: 404,
    message: "The requested record was not found",
  });
});

function invokeErrorHandler(error: Error): {
  status: number;
  body: unknown;
} {
  const result = { status: 500, body: undefined as unknown };
  const response = {
    status(status: number) {
      result.status = status;
      return this;
    },
    json(body: unknown) {
      result.body = body;
      return this;
    },
  } as Response;

  errorHandler(
    error,
    { method: "POST", path: "/test" } as Request,
    response,
    () => undefined,
  );

  return result;
}
