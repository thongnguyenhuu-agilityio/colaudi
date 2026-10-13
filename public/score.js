// Scoring rules for Cờ Lau Đi. Pure functions: shared by the game (browser) and the API (server).

/** Points by number of wrong tries before the right answer: first try 3, one miss 1, two misses 0. */
export const POINTS = [3, 1, 0];
export const BATTLES = 12;
export const MAX_POINTS = POINTS[0] * BATTLES; // 36
export const MIN_TIME_SEC = 15;
export const MAX_TIME_SEC = 2 * 60 * 60;

export function pointsFor(wrongTries) {
  if (!Number.isInteger(wrongTries) || wrongTries < 0) {
    throw new RangeError('wrongTries must be a non-negative integer');
  }
  return POINTS[Math.min(wrongTries, POINTS.length - 1)];
}

/** results: { [warlordId]: wrongTries } */
export function totalPoints(results) {
  return Object.values(results).reduce((sum, w) => sum + pointsFor(w), 0);
}

/** Higher is better: more points first, then the faster time. */
export function rankValue(points, timeSec) {
  const t = Math.min(Math.max(Math.round(timeSec), 0), 99999);
  return points * 100000 + (99999 - t);
}

export function formatTime(timeSec) {
  const s = Math.max(0, Math.round(timeSec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
