import React, { useEffect, useState, useReducer } from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Stack, Center, Text, Box, Tag,
} from '@chakra-ui/react';
import { calculateTimeRemaining } from './Time';
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
    timeLastPaused: 0,
    elapsedDuringPause: 0,
  });
  const {
    workingStatus, running, timeStarted, timeLastPaused,
  } = pomodoroState;
  function setPomodoroStateItems(newState: Object) {
    return setPomodoroState({ ...pomodoroState, ...newState });
  }

  const statusToggleShouldAppear = (
    workingStatus !== STATES.notWorking
    && workingStatus !== STATES.paused);

  let timerId: number = 0;
  useEffect(() => {
    if (running) {
      timerId = window.setTimeout(() => {
        // the timer will update itself by
        // the forward progression of time,
        // away from timeStarted
        forceUpdate();
        console.log("effect"); // eslint-disable-line
      }, 1000);
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
      setPomodoroStateItems({
        status: newStatus,
      });
    }
  }

  function onPause() {
    if (workingStatus === STATES.working
      || workingStatus === STATES.planning) {
      setPomodoroStateItems({
        workingStatus: STATES.paused,
        timeLastPaused: Date.now(),
        running: false,
      });
      // clearInterval(timerId); <-- Didn't do anything
    }
  }

  function onStart() {
    if (workingStatus === STATES.notWorking || workingStatus === STATES.paused) {
      if (!timeStarted) {
        setPomodoroStateItems({
          timeStarted: Date.now(),
          workingStatus: STATES.defaultDirty,
          running: true,
        });
      } else {
        // If starting from paused, resume with
        // the original start time intact
        setPomodoroStateItems({
          running: true,
          workingStatus: STATES.defaultDirty,
        });
      }
    }
  }

  function onReset() {
    clearTimeout(timerId);
    setPomodoroStateItems({
      workingStatus: STATES.notWorking,
      running: false,
      timeStarted: 0,
      timeLastPaused: 0,
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
