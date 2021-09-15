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

export function calculateTimeRemaining(timerState: TimerState): number {
  const { lastRecordedTime, lastRecordedElapsed } = timerState;

  const lastRecorded = lastRecordedTime || Date.now();
  const newElapsed = Date.now() - lastRecorded;
  const totalElapsed = lastRecordedElapsed + newElapsed;
  if (totalElapsed < INITIAL_TIME_IN_MILLIS) {
    return INITIAL_TIME_IN_MILLIS - totalElapsed;
  }
  return 0;
}

export function getFormattedTimeRemaining(timerState: TimerState): string {
  return formatDateDiff(calculateTimeRemaining(timerState));
}
