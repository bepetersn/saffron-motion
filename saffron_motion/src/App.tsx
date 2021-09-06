import React from 'react';
import {
  CSSReset, Flex, ChakraProvider, ButtonGroup, Button, Stack, Center, Text, Box, Tag,
} from '@chakra-ui/react';
import './App.css';

function App() {
  const timeInMinutes = 25;
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
                {timeInMinutes}
                :00
              </Text>
            </Center>
          </Flex>
          <Flex justify="center" align="center" w="100%" h="20vh">
            <ButtonGroup>
              <Button>Start</Button>
              <Button>Stop</Button>
              <Button>Reset</Button>
            </ButtonGroup>
          </Flex>
          <Flex justify="center" align="center" w="100%" h="20vh">
            <Box>
              <Flex alignItems="center">
                <Text>
                  Status:
                  {' '}
                </Text>
                <Tag>
                  <Text fontSize="3vw">Working</Text>
                </Tag>
                <Button bgColor="lightSkyBlue">
                  Toggle to Planning
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
