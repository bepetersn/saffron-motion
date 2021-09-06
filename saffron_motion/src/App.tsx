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
                      Working
                    </Text>
                  </Tag>
                </Flex>
                <Flex>
                  <Button bgColor="goldenrod">
                    Toggle
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
