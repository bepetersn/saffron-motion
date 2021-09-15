import { STATES, INITIAL_POMODORO_STATE } from './App';

/* eslint-disable */
// Got "no-unused-vars", but it is used
enum ActionType {
  START = 'START',
  PAUSE = 'PAUSE',
  RESET = 'RESET',
  TOGGLE_WORKING_STATUS = 'TOGGLE_WORKING_STATUS',
  CHANGE_PLAN = 'CHANGE_PLAN',
}
/* eslint-enable */

type Action =
  { type: ActionType.START } |
  { type: ActionType.PAUSE } |
  { type: ActionType.RESET } |
  { type: ActionType.TOGGLE_WORKING_STATUS } |
  { type: ActionType.CHANGE_PLAN, payload: string }

type PomodoroState = {
  running: boolean,
  timeStarted: number,
  lastRecordedTime: number,
  lastRecordedElapsed: number,
  workingStatus: string, // TODO: Should be enum of STATES
  planningText: string,
  tick: number,
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
      return INITIAL_POMODORO_STATE;

    case ActionType.TOGGLE_WORKING_STATUS:
      if (state.workingStatus === STATES.working) {
        return {
          ...state,
          workingStatus: STATES.planning,
        };
      }
      if (state.workingStatus === STATES.planning) {
        return {
          ...state,
          workingStatus: STATES.working,
        };
      }
      return state;
    case ActionType.CHANGE_PLAN:
      return {
        ...state,
        planningText: action.payload,
      };

    default:
      throw new Error();
  }
}

export default reducer;
export { ActionType };
export type { PomodoroState, TimerState };
