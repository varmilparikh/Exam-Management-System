import assert from "node:assert/strict";
import test from "node:test";
import { formatSessionTime, hasSessionStarted, sessionsOverlap } from "./examSession.utils.js";

const day = new Date("2026-12-12T00:00:00.000Z");
const time = (value: string) => new Date(`1970-01-01T${value}:00.000Z`);

test("exam sessions overlap only when date and time intervals intersect", () => {
  assert.equal(sessionsOverlap({ examDate: day, startTime: time("10:00"), endTime: time("13:00") }, { examDate: day, startTime: time("12:00"), endTime: time("14:00") }), true);
  assert.equal(sessionsOverlap({ examDate: day, startTime: time("10:00"), endTime: time("13:00") }, { examDate: day, startTime: time("13:00"), endTime: time("15:00") }), false);
  assert.equal(sessionsOverlap({ examDate: day, startTime: time("10:00"), endTime: time("13:00") }, { examDate: new Date("2026-12-13T00:00:00.000Z"), startTime: time("10:00"), endTime: time("13:00") }), false);
});

test("session time formatting preserves its timezone-independent clock time", () => {
  assert.equal(formatSessionTime(time("14:05")), "14:05");
});

test("session start detection uses the configured institution timezone", () => {
  const session = { examDate: day, startTime: time("10:00"), endTime: time("13:00") };
  assert.equal(hasSessionStarted(session, new Date("2026-12-12T04:29:00.000Z")), false);
  assert.equal(hasSessionStarted(session, new Date("2026-12-12T04:30:00.000Z")), true);
});
