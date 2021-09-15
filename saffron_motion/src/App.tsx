import React, {
  useReducer, ReactElement, useEffect, useLayoutEffect,
} from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Text, Tag, Input,
} from '@chakra-ui/react';
import { getFormattedTimeRemaining } from './Time';
import './App.css';
import reducer, { ActionType, PomodoroState, TimerState } from './Reducer';

// const APP_NAME = 'Saffron Motion';

export const STATES = {
  paused: 'Paused',
  working: 'Working',
  planning: 'Planning',
  notWorking: 'Not working',
  defaultDirty: 'Planning',
};

export const INITIAL_POMODORO_STATE: PomodoroState = {
  workingStatus: STATES.notWorking,
  running: false,
  timeStarted: 0,
  lastRecordedTime: 0,
  lastRecordedElapsed: 0,
  tick: 0,
};

// type AppProps = {};

export default function App(): ReactElement {
  const [tick, showPassageOfTime] = useReducer((x) => x + 1, 0);
  const [state, dispatch] = useReducer(reducer, INITIAL_POMODORO_STATE);
  const { workingStatus, running } = state;
  const timerState: TimerState = {
    running: state.running,
    timeStarted: state.timeStarted,
    lastRecordedTime: state.lastRecordedTime,
    lastRecordedElapsed: state.lastRecordedElapsed,
  };

  useEffect(() => {
    // NOTE below:
    // If changing running and it's now true, we have ActionType.START.
    // So, create a timer in the following closure iff running is true.
    // Only schedule cleanup if running was true for this render.
    // Running must be changing to false if called again, so it's appropriate to clear the timer.
    let timerId = 0;
    if (running) {
      showPassageOfTime(); // Updating state is necessary to flush changes
      timerId = window.setInterval(() => {
        showPassageOfTime(); // Update about each second
      }, 1000);
    }

    return () => {
      if (running) {
        clearInterval(timerId);
      }
    };
  }, [running]);

  useLayoutEffect(() => {
    // Layout because it's nice to have the document title closely in sync
    document.title = getFormattedTimeRemaining(timerState);
  }, [tick]);

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
              {getFormattedTimeRemaining(timerState)}
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
              <Input placeholder="What are you working on...?" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
