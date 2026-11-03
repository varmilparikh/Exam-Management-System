import assert from "node:assert/strict";
import { test } from "node:test";
import { isRefreshTokenVersionCurrent } from "./refreshTokenVersion.js";

test("legacy refresh tokens remain valid at the default version", () => {
  assert.equal(isRefreshTokenVersionCurrent(undefined, 0), true);
});

test("refresh tokens stop matching after their account version changes", () => {
  assert.equal(isRefreshTokenVersionCurrent(4, 4), true);
  assert.equal(isRefreshTokenVersionCurrent(3, 4), false);
});
