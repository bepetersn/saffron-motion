import React, {
  useReducer, ReactElement, useEffect,
} from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Text, Tag, Input,
} from '@chakra-ui/react';
import { formatDateDiff, calculateTimeRemaining } from './Time';
import './App.css';
import reducer, { ActionType, PomodoroState, TimerState } from './Reducer';

export const STATES = {
  paused: 'Paused',
  working: 'Working',
  planning: 'Planning',
  notWorking: 'Not working',
  defaultDirty: 'Planning',
};

function initPomodoroState(): PomodoroState {
  return {
    workingStatus: STATES.notWorking,
    running: false,
    timeStarted: 0,
    lastRecordedTime: 0,
    lastRecordedElapsed: 0,
  };
}

// type AppProps = {};

export default function App(): ReactElement {
  const [, tickTheClock] = useReducer((x) => x + 1, 0);
  const [state, dispatch] = useReducer(reducer, null, initPomodoroState);
  const { workingStatus, running } = state;
  const timerState: TimerState = {
    timeStarted: state.timeStarted,
    lastRecordedTime: state.lastRecordedTime,
    lastRecordedElapsed: state.lastRecordedElapsed,
  };

  useEffect(() => {
    let timerId = 0;
    if (running) {
      timerId = window.setInterval(() => {
        tickTheClock(); // Re-render to show a current timeRemaining calculation
      }, 1000);
    }
    // NOTE below: The timer is created in the closure above where running must be true.
    // Therefore this will only cleanup after a timer has indeed been setup.
    // It will only be called when running is changing (see deps below).
    // Therefore, running is changing to false, and it's appropriate to clear the timer.
    return () => {
      if (running) {
        clearInterval(timerId);
      }
    };
  }, [running]); // Setup a new interval each time we change running (iff running, see above)

  return (
    <ChakraProvider>
      <Flex direction="row" justifyContent="space-around">
        <CSSReset />
        <Flex id="timerContainer" flexDirection="column" justifyContent="stretch">
          <Flex id="modeButtons" w="100%" h="20vh" alignItems="center">
            <ButtonGroup>
              <Button>Pomodoro</Button>
              <Button>Short Break</Button>
              <Button>Long Break</Button>
            </ButtonGroup>
          </Flex>
          <Flex id="timer" w="100%" h="30vh" justify="center" align="center">
            <Text fontSize="8vw">
              {formatDateDiff(calculateTimeRemaining(timerState))}
            </Text>
          </Flex>
          <Flex id="timerButtons" justify="center" align="center" w="100%" h="20vh">
            <ButtonGroup>
              <Button onClick={() => dispatch({ type: ActionType.START })}>Start</Button>
              <Button onClick={() => dispatch({ type: ActionType.PAUSE })}>Pause</Button>
              <Button onClick={() => dispatch({ type: ActionType.RESET })}>Reset</Button>
            </ButtonGroup>
          </Flex>
        </Flex>
        <Flex id="statusContainer" flex-direction="column" flexWrap="wrap" justify="center" align="center" h="20vh" w="30vw">
          <Flex flexDirection="row" alignItems="center">
            <Text fontSize="3vw">
              Status:
              {' '}
            </Text>
            <Tag bgColor="lightSkyBlue" ml="5px" mr="10px" border="1px solid black">
              <Text fontSize="3vw">
                {workingStatus}
              </Text>
            </Tag>
          </Flex>
          {running && (
            <Flex>
              <Button
                bgColor="goldenrod"
                onClick={() => dispatch({ type: ActionType.TOGGLE_WORKING_STATUS })}
              >
                Toggle
              </Button>
            </Flex>
          )}
          {running && (
            <Flex justify="center">
              <Input placeholder="Working on...?" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
