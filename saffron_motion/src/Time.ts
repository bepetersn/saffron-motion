import { TimerState } from './Reducer';

// 25 minutes in milliseconds
export const INITIAL_TIME_IN_MILLIS = 25 * 60 * 1000;

export function parseDateDiff(dateDiffStr: string): number {
  /* convert from mm:ss to diff */
  const [minutesStr, secondsStr] = dateDiffStr.split(':');
  const [minutes, seconds] = [parseInt(minutesStr, 10), parseInt(secondsStr, 10)];
  return (minutes * 60 * 1000) + (seconds * 1000);
}

export function formatDateDiff(dateDiff: number): string {
  /* convert diff to mm:ss format */
  const minutes = Math.floor(dateDiff / (1000 * 60));
  const seconds = Math.floor(
    (dateDiff / 1000) - (minutes * 60) // eslint-disable-line comma-dangle
  );
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  return `${minutesStr}:${secondsStr}`;
}

export function calculateTimeRemaining(timeState: TimerState): number {
  const { timeStarted, lastRecordedTime, lastRecordedElapsed } = timeState;

  const lastRecorded = lastRecordedTime || timeStarted || Date.now();
  const newElapsed = Date.now() - lastRecorded;
  const millisRemaining = (
    INITIAL_TIME_IN_MILLIS
    - lastRecordedElapsed
    - newElapsed
  );
  return millisRemaining;
}
