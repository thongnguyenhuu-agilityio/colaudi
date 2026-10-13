import { describe, it, expect } from 'vitest';
import { pointsFor, totalPoints, rankValue, formatTime, MAX_POINTS } from '../public/score.js';

describe('pointsFor', () => {
  it('gives 3 / 1 / 0 for 0 / 1 / 2 wrong tries', () => {
    expect(pointsFor(0)).toBe(3);
    expect(pointsFor(1)).toBe(1);
    expect(pointsFor(2)).toBe(0);
  });
  it('never goes below 0', () => expect(pointsFor(5)).toBe(0));
  it('rejects invalid input', () => {
    expect(() => pointsFor(-1)).toThrow(RangeError);
    expect(() => pointsFor(1.5)).toThrow(RangeError);
  });
});

describe('totalPoints', () => {
  it('sums every battle', () => expect(totalPoints({ a: 0, b: 1, c: 2 })).toBe(4));
  it('is 36 for a perfect run of 12', () => {
    const perfect = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`l${i}`, 0]));
    expect(totalPoints(perfect)).toBe(MAX_POINTS);
  });
  it('is 0 before any battle', () => expect(totalPoints({})).toBe(0));
});

describe('rankValue', () => {
  it('ranks more points first', () => expect(rankValue(30, 900)).toBeGreaterThan(rankValue(29, 60)));
  it('breaks ties by the faster time', () => expect(rankValue(30, 120)).toBeGreaterThan(rankValue(30, 121)));
});

describe('formatTime', () => {
  it('formats m:ss', () => {
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(0)).toBe('0:00');
  });
});
