/**
 * Returns true if the given date is in the past.
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < Date.now();
}