import { calculateTimeRemaining, parseDateDiff } from './Time';

test('calc test -- countdown 7sec', () => {
  const timeStarted = Date.now() - 7000;
  const lastRecordedElapsed = 7000;
  const lastRecordedTime = Date.now();
  expect(calculateTimeRemaining(
    timeStarted, lastRecordedTime, lastRecordedElapsed,
  )).toBeLessThan(parseDateDiff('24:54'));
});

test('calc test -- countdown with pause/start', () => {
  // Started 11 seconds ago
  const timeStarted = Date.now() - 11000;
  // Paused 8 seconds ago -- Not visible -- (LRT = Date.now() - 8000)
  // 3 seconds had passed
  const lastRecordedElapsed = 3000;
  // Started again 4 seconds ago
  const lastRecordedTime = Date.now() - 4000;
  // 4 seconds have passed

  // 3sec + 4sec = 7sec passed
  expect(calculateTimeRemaining(
    timeStarted, lastRecordedTime, lastRecordedElapsed,
  )).toBeLessThanOrEqual(parseDateDiff('24:53'));
});

test('calc test -- countdown with multiple pause/start', () => {
  // Started 15 seconds ago
  const timeStarted = Date.now() - 15000;
  // Paused 10 seconds ago -- Not visible -- (LRT = Date.now() - 8000)
  // 5 seconds had passed -- Not visible
  let lastRecordedElapsed = 5000;
  // Resumed 7 seconds ago
  // NOT VISIBLE -- let lastRecordedTime = Date.now() - 7000;
  // Paused again 5 seconds ago
  // NOT VISIBLE -- lastRecordedTime = Date.now() - 5000;
  // 2 seconds had passed, additional
  lastRecordedElapsed += 2000;
  // Resumed 3 seconds ago
  const lastRecordedTime = Date.now() - 3000;
  // 3 seconds have passed

  // 5sec + 2sec + 3sec = 10sec passed
  expect(calculateTimeRemaining(
    timeStarted, lastRecordedTime, lastRecordedElapsed,
  )).toBeLessThanOrEqual(parseDateDiff('24:50'));
});
