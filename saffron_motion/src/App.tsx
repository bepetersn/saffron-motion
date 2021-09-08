import React, { useEffect, useState, useReducer } from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Stack, Center, Text, Box, Tag,
} from '@chakra-ui/react';
import './App.css';

export const STATES = {
  paused: 'Paused',
  working: 'Working',
  planning: 'Planning',
  notWorking: 'Not working',
  defaultDirty: 'Planning',
};

// 25 minutes in milliseconds
const INITIAL_TIME_IN_MILLIS = 25 * 60 * 1000;

function formatDateDiff(dateDiff: number) {
  /* convert to mm:ss format */
  const minutes = Math.floor(dateDiff / (1000 * 60));
  const seconds = Math.floor(
    (dateDiff / 1000) - (minutes * 60) // eslint-disable-line comma-dangle
  );
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  return `${minutesStr}:${secondsStr}`;
}

function App() {
  const [, forceUpdate] = useReducer((_) => _ + 1, 0);
  const [workingStatus, setWorkingStatus] = useState(STATES.notWorking);
  const [running, setRunning] = useState(false);
  const [timeLastPaused, setTimeLastPaused] = useState(0);
  const [timeStarted, setTimeStarted] = useState(0);
  const statusToggleShouldAppear = (
    workingStatus !== STATES.notWorking
    && workingStatus !== STATES.paused);

  let timerId: number = 0;
  useEffect(() => {
    if (running) {
      timerId = window.setTimeout(() => {
        // The timeRemaining will update itself by
        // the forward progression of time,
        // away from timeStarted, by 1 second.
        // Therefore, show the new time...
        forceUpdate();
      }, 1000);
      // clear timer if component is unmounted
      return () => clearTimeout(timerId);
    }
    return () => {
      // do nothing if timer wasn't setup
    };
  });

  function calculateTimeRemaining() {
    let elapsedSincePause = 0;
    let elapsedBeforePause = 0;
    if (timeLastPaused !== 0) {
      elapsedSincePause = Date.now() - timeLastPaused;
      elapsedBeforePause = timeLastPaused - timeStarted;
    }
    const millisRemaining = (
      INITIAL_TIME_IN_MILLIS
      - elapsedBeforePause
      - elapsedSincePause
    );
    // No negative time remaining
    return formatDateDiff(millisRemaining < 0 ? 0 : millisRemaining);
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
      setWorkingStatus(newStatus);
    }
  }

  function onPause() {
    if (workingStatus === STATES.working
      || workingStatus === STATES.planning) {
      setWorkingStatus(STATES.paused);
      setTimeLastPaused(Date.now());
      setRunning(false);
    }
  }

  function onStart() {
    if (workingStatus === STATES.notWorking || workingStatus === STATES.paused) {
      setWorkingStatus(STATES.defaultDirty);
      if (!timeStarted) {
        // If starting from paused, resume with
        // the original start time intact
        setTimeStarted(Date.now());
      }
      setRunning(true);
    }
  }

  function onReset() {
    setWorkingStatus(STATES.notWorking);
    setRunning(false);
    setTimeStarted(0);
    setTimeLastPaused(0);
    clearTimeout(timerId);
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
                {calculateTimeRemaining()}
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
