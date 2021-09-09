// 25 minutes in milliseconds
export const INITIAL_TIME_IN_MILLIS = 25 * 60 * 1000;

export function parseDateDiff(dateDiffStr: string) {
  /* convert from mm:ss to diff */
  const [minutesStr, secondsStr] = dateDiffStr.split(':');
  const [minutes, seconds] = [parseInt(minutesStr, 10), parseInt(secondsStr, 10)];
  return (minutes * 60 * 1000) + (seconds * 1000);
}

export function formatDateDiff(dateDiff: number) {
  /* convert diff to mm:ss format */
  const minutes = Math.floor(dateDiff / (1000 * 60));
  const seconds = Math.floor(
    (dateDiff / 1000) - (minutes * 60) // eslint-disable-line comma-dangle
  );
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  return `${minutesStr}:${secondsStr}`;
}

export function calculateTimeRemaining(
  timeStarted: number, lastRecordedTime: number, lastRecordedElapsed: number,
) {
  const lastRecorded = lastRecordedTime || timeStarted;
  // NOTE: Avoid a small race condition via ternary expression?
  const newElapsed = timeStarted ? (Date.now() - lastRecorded) : 0;
  const millisRemaining = (
    INITIAL_TIME_IN_MILLIS
    - lastRecordedElapsed
    - newElapsed
  );
  return millisRemaining;
}
