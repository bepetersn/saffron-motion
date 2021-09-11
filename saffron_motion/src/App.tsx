import React, {
  useState, useRef,
} from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Stack, Center, Text, Tag,
} from '@chakra-ui/react';
import { formatDateDiff, INITIAL_TIME_IN_MILLIS } from './Time';
import './App.css';

export const STATES = {
  paused: 'Paused',
  working: 'Working',
  planning: 'Planning',
  notWorking: 'Not working',
  defaultDirty: 'Planning',
};

export default function App() {
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME_IN_MILLIS);
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

  const timerRef = useRef(0);

  function onTick() {
    setTimeRemaining((time) => (time > 0 ? time - 1000 : 0));
  }

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

  function onStart() {
    if (workingStatus === STATES.notWorking || workingStatus === STATES.paused) {
      timerRef.current = window.setInterval(onTick, 1000);
      if (!timeStarted) {
        setPomodoroState({
          ...pomodoroState,
          timeStarted: Date.now(),
          workingStatus: STATES.defaultDirty,
          running: true,
        });
      } else {
        setPomodoroState({
          ...pomodoroState,
          running: true,
          workingStatus: STATES.defaultDirty,
          lastTimeRecorded: Date.now(),
        });
      }
    }
  }

  function onPause() {
    if (running) {
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
      timerRef.current = 0;
    }
  }

  function onReset() {
    clearInterval(timerRef.current);
    timerRef.current = 0;
    setTimeRemaining(INITIAL_TIME_IN_MILLIS);
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
                {formatDateDiff(timeRemaining)}
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
          <Flex flex-direction="column" flexWrap="wrap" justify="center" align="center" h="20vh" w="30vw">
            <Flex flexDirection="row" justify="center" alignItems="center">
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
                <Button bgColor="goldenrod" onClick={() => onStatusToggle()}>
                  Toggle
                </Button>
              </Flex>
            )}
            {running && (
              <Flex justify="center">
                <input placeholder="What are you planning to work on?" />
              </Flex>
            )}
          </Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
