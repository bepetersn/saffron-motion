import React, {
  useEffect, useState, useReducer, useRef,
} from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Stack, Center, Text, Box, Tag,
} from '@chakra-ui/react';
import { calculateTimeRemaining, formatDateDiff } from './Time';
import './App.css';

export const STATES = {
  paused: 'Paused',
  working: 'Working',
  planning: 'Planning',
  notWorking: 'Not working',
  defaultDirty: 'Planning',
};

function App() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [pomodoroState, setPomodoroState] = useState({
    workingStatus: STATES.notWorking,
    running: false,
    timeStarted: 0,
    lastTimeRecorded: 0,
    lastTimeElapsed: 0,
  });
  const {
    workingStatus, running, timeStarted,
    lastTimeRecorded, lastTimeElapsed,
  } = pomodoroState;

  const statusToggleShouldAppear = (
    workingStatus !== STATES.notWorking
    && workingStatus !== STATES.paused);

  const timerRef = useRef(0);

  function onTick() {
    // the timer will update itself by
    // the forward progression of time,
    // away from timeStarted
    forceUpdate();
  }

  useEffect(() => {
    if (running) {
      timerRef.current = window.setTimeout(onTick, 1000);
      // // clear timer if component is unmounted
      // return () => clearTimeout(timer);
    }
    return () => {
      // do nothing if timer wasn't setup
    };
  });

  function onStatusToggle() {
    let newStatus = null;
    if (workingStatus === STATES.working) {
      newStatus = STATES.planning;
    } else if (workingStatus === STATES.planning) {
      newStatus = STATES.working;
    } else {
      // do nothing
    }
    if (newStatus) {
      setPomodoroState({
        ...pomodoroState,
        workingStatus: newStatus,
      });
    }
  }

  function onPause() {
    if (workingStatus === STATES.working
      || workingStatus === STATES.planning) {
      const lastRecorded = lastTimeRecorded || timeStarted;
      const newElapsed = Date.now() - lastRecorded;
      setPomodoroState({
        ...pomodoroState,
        workingStatus: STATES.paused,
        lastTimeRecorded: Date.now(),
        lastTimeElapsed: lastTimeElapsed + newElapsed,
        running: false,
      });
      clearInterval(timerRef.current);
    }
  }

  function onStart() {
    if (workingStatus === STATES.notWorking || workingStatus === STATES.paused) {
      if (!timeStarted) {
        setPomodoroState({
          ...pomodoroState,
          // only the very first time (not for resuming), set timeStarted
          timeStarted: Date.now(),
          // Revert to defaultDirty status (planning) on every start;
          // -- Rather than preserving what status you were in prior to pause --
          // Kind of an annoying behavior if pausing much at all, but does force
          // you to actually think about planning; May re-assess this.
          workingStatus: STATES.defaultDirty,
          running: true,
        });
      } else {
        setPomodoroState({
          ...pomodoroState,
          running: true,
          workingStatus: STATES.defaultDirty,
          // Record the last time we have seen
          // information about the timer change
          // in place of timeStarted
          lastTimeRecorded: Date.now(),
        });
      }
    }
  }

  function onReset() {
    clearTimeout(timerRef.current);
    setPomodoroState({
      workingStatus: STATES.notWorking,
      running: false,
      timeStarted: 0,
      lastTimeRecorded: 0,
      lastTimeElapsed: 0,
    });
  }

  return (
    <ChakraProvider>
      <Flex direction="column" align="center" justify="center">
        <CSSReset />
        <Stack>
          <Flex justify="center" align="center" w="100%" h="20vh">
            <ButtonGroup>
              <Button>Pomodoro</Button>
              <Button>Short Break</Button>
              <Button>Long Break</Button>
            </ButtonGroup>
          </Flex>
          <Flex justify="center" align="center" w="100%" h="30vh">
            <Center>
              <Text fontSize="8vw">
                {formatDateDiff(calculateTimeRemaining(
                  timeStarted, lastTimeRecorded, lastTimeElapsed,
                ))}
              </Text>
            </Center>
          </Flex>
          <Flex justify="center" align="center" w="100%" h="20vh">
            <ButtonGroup>
              <Button onClick={() => onStart()}>Start</Button>
              <Button onClick={() => onPause()}>Pause</Button>
              <Button onClick={() => onReset()}>Reset</Button>
            </ButtonGroup>
          </Flex>
          <Flex justify="center" align="center" w="125%" h="20vh">
            <Box>
              <Flex flexDirection="row" justify="center" alignItems="center">
                <Flex>
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
                {statusToggleShouldAppear && (
                  <Flex>
                    <Button bgColor="goldenrod" onClick={() => onStatusToggle()}>
                      Toggle
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
