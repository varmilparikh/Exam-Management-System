export interface ExamSessionTime {
  examDate: Date;
  startTime: Date;
  endTime: Date;
}

export function timeOfDayToMinutes(value: Date): number {
  return value.getUTCHours() * 60 + value.getUTCMinutes();
}

export function sessionsOverlap(first: ExamSessionTime, second: ExamSessionTime) {
  if (first.examDate.toISOString().slice(0, 10) !== second.examDate.toISOString().slice(0, 10)) {
    return false;
  }
  return (
    timeOfDayToMinutes(first.startTime) < timeOfDayToMinutes(second.endTime) &&
    timeOfDayToMinutes(first.endTime) > timeOfDayToMinutes(second.startTime)
  );
}

function partsInInstitutionTimeZone(date: Date) {
  const timeZone = process.env.EXAM_TIME_ZONE || "Asia/Kolkata";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function hasSessionStarted(session: ExamSessionTime, now = new Date()) {
  const nowParts = partsInInstitutionTimeZone(now);
  const today = `${nowParts.year}-${nowParts.month}-${nowParts.day}`;
  const sessionDate = session.examDate.toISOString().slice(0, 10);
  if (sessionDate < today) return true;
  if (sessionDate > today) return false;
  const currentMinutes = Number(nowParts.hour) * 60 + Number(nowParts.minute);
  return timeOfDayToMinutes(session.startTime) <= currentMinutes;
}

export function formatSessionTime(value: Date): string {
  return `${String(value.getUTCHours()).padStart(2, "0")}:${String(value.getUTCMinutes()).padStart(2, "0")}`;
}
