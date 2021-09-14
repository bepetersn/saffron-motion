import { STATES, APP_NAME } from './App';

/* eslint-disable */
// Got "no-unused-vars", but it is used
enum ActionType {
  START = 'START',
  PAUSE = 'PAUSE',
  RESET = 'RESET',
  TOGGLE_WORKING_STATUS = 'TOGGLE_WORKING_STATUS',
}
/* eslint-enable */

type Action =
  { type: ActionType.START } |
  { type: ActionType.PAUSE } |
  { type: ActionType.RESET } |
  { type: ActionType.TOGGLE_WORKING_STATUS }

type PomodoroState = {
  running: boolean,
  timeStarted: number,
  lastRecordedTime: number,
  lastRecordedElapsed: number,
  workingStatus: string,
  docTitle: string,
}

type TimerState = Pick<PomodoroState,
  'running' | 'timeStarted' | 'lastRecordedTime' | 'lastRecordedElapsed'>;

function reducer(state: PomodoroState, action: Action): PomodoroState {
  const newElapsed = Date.now() - state.lastRecordedTime;
  switch (action.type) {
    case ActionType.START:
      if (state.workingStatus === STATES.notWorking
        || state.workingStatus === STATES.paused) {
        if (!state.timeStarted) {
          return {
            ...state,
            running: true,
            workingStatus: STATES.defaultDirty,
            timeStarted: Date.now(),
            lastRecordedTime: Date.now(),
          };
        }
        return {
          ...state,
          running: true,
          workingStatus: STATES.defaultDirty,
          lastRecordedTime: Date.now(),
        };
      }
      return state;

    case ActionType.PAUSE:
      if (!state.running) {
        return state;
      }
      return {
        ...state,
        workingStatus: STATES.paused,
        lastRecordedTime: Date.now(),
        lastRecordedElapsed: state.lastRecordedElapsed + newElapsed,
        running: false,
      };
    case ActionType.RESET:
      return {
        workingStatus: STATES.notWorking,
        running: false,
        timeStarted: 0,
        lastRecordedTime: 0,
        lastRecordedElapsed: 0,
        docTitle: APP_NAME,
      };
    case ActionType.TOGGLE_WORKING_STATUS:
      if (state.workingStatus === STATES.working) {
        return {
          ...state,
          workingStatus: STATES.planning,
        };
      }
      if (state.workingStatus === STATES.paused) {
        return {
          ...state,
          workingStatus: STATES.working,
        };
      }
      return state;
    default:
      throw new Error();
  }
}

export default reducer;
export { ActionType };
export type { PomodoroState, TimerState };
