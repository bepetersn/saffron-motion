import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { STATES } from './App';

test('renders mode toggles', () => {
  render(<App />);
  let buttonElement: HTMLElement = screen.getByText(/short break/i);
  expect(buttonElement).toBeInTheDocument();

  buttonElement = screen.getByText(/long break/i);
  expect(buttonElement).toBeInTheDocument();

  buttonElement = screen.getByText(/pomodoro/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders start time (25 minutes)', () => {
  render(<App />);
  const textElement: HTMLElement = screen.getByText(/25:00/i);
  expect(textElement).toBeInTheDocument();
});

test('renders action buttons', () => {
  render(<App />);
  let buttonElement: HTMLElement = screen.getByText(/start/i);
  expect(buttonElement).toBeInTheDocument();
  buttonElement = screen.getByText(/pause/i);
  expect(buttonElement).toBeInTheDocument();
  buttonElement = screen.getByText(/reset/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders status', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(/status/i);
  expect(statusElement).toBeInTheDocument();
});

test('toggle button changes status from planning to working and back', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  const startButton: HTMLElement = screen.getByText(/start/i);
  startButton.click();
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  toggleButton.click();
  expect(statusElement).toHaveTextContent(STATES.working);
  toggleButton.click();
  expect(statusElement).toHaveTextContent(STATES.planning);
});

test('pause button changes status from working / planning to paused', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const pauseButton: HTMLElement = screen.getByText(/pause/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click();
  pauseButton.click();
  expect(statusElement).toHaveTextContent(STATES.paused);
});

test('pause button does not change status from not working', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  const pauseButton: HTMLElement = screen.getByText(/pause/i);
  pauseButton.click(); // Nothing happens
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});

test('start button changes status from paused to planning', () => {
  render(<App />);
  const pauseButton: HTMLElement = screen.getByText(/pause/i);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  pauseButton.click();
  startButton.click();
  expect(statusElement).toHaveTextContent(STATES.defaultDirty);
});

test('start button doesn\'t change status from planning', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click(); // => Planning
  startButton.click(); // Nothing Happened
  expect(statusElement).toHaveTextContent(STATES.planning);
});

test('start button doesn\'t change status from working', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click(); // => Planning
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  toggleButton.click(); // => Working
  startButton.click(); // Nothing happened
  expect(statusElement).toHaveTextContent(STATES.working);
});

test('reset button doesn\'t change status from paused', () => {
  render(<App />);
  const resetButton: HTMLElement = screen.getByText(/reset/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  resetButton.click(); // Nothing happens
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});

test('reset button changes status from planning to not working', () => {
  render(<App />);
  const resetButton: HTMLElement = screen.getByText(/reset/i);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click(); // => Planning
  resetButton.click(); // => Not Working
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});

test('reset button changes status from working to not working', () => {
  render(<App />);
  const resetButton: HTMLElement = screen.getByText(/reset/i);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click(); // => Planning
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  toggleButton.click(); // => Working
  resetButton.click(); // => Not Working
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});

test('toggle button should not be visible initally', () => {
  render(<App />);
  const toggleButton: HTMLElement | null = screen.queryByText(/toggle/i);
  expect(toggleButton).toBeNull();
});

test('toggle button should be visible if working / planning', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  startButton.click(); // => Planning
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  expect(toggleButton).toBeInTheDocument();
});

test('toggle button should not be visible if paused', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const pauseButton: HTMLElement = screen.getByText(/pause/i);
  startButton.click(); // => Planning
  pauseButton.click(); // => Paused
  const toggleButton: HTMLElement | null = screen.queryByText(/toggle/i);
  expect(toggleButton).toBeNull();
});

test('start button should change the timer', (done) => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  startButton.click(); // => Planning
  setTimeout(() => { // TODO: Use async methods instead of this hack
    try {
      const particularTime25Min: HTMLElement | null = screen.queryByText(/25:00/i);
      expect(particularTime25Min).toBeNull();
      done();
    } catch (error) {
      done(error);
    }
  }, 2000); // NOTE: Wait more than a second... for some reason...
});

test('planning input should be visible if working / planning', () => {
  render(<App />);
  const startButton: HTMLElement = screen.getByText(/start/i);
  startButton.click(); // => Planning
  const planningInput: HTMLElement = screen.getByPlaceholderText('What are you working on...?');
  expect(planningInput).toBeInTheDocument();
});
