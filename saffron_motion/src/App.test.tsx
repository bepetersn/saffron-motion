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
  buttonElement = screen.getByText(/stop/i);
  expect(buttonElement).toBeInTheDocument();
  buttonElement = screen.getByText(/reset/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders action buttons', () => {
  render(<App />);
  let buttonElement: HTMLElement = screen.getByText(/start/i);
  expect(buttonElement).toBeInTheDocument();
  buttonElement = screen.getByText(/stop/i);
  expect(buttonElement).toBeInTheDocument();
  buttonElement = screen.getByText(/reset/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders status', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(/status/i);
  expect(statusElement).toBeInTheDocument();
});

test('renders status toggle button', () => {
  render(<App />);
  const buttonElement: HTMLElement = screen.getByText(/toggle/i);
  expect(buttonElement).toBeInTheDocument();
});

test('toggle button changes status from planning to working', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  const startButton: HTMLElement = screen.getByText(/start/i);
  startButton.click();
  toggleButton.click();
  expect(statusElement).toHaveTextContent(STATES.working);
});

test('toggle button doesn\'t change status from not working to working', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  toggleButton.click();
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});

test('stop button changes status to stopped', () => {
  render(<App />);
  const stopButton: HTMLElement = screen.getByText(/stop/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  stopButton.click();
  expect(statusElement).toHaveTextContent(STATES.stopped);
});

test('start button changes status from not working to planning', () => {
  render(<App />);
  const stopButton: HTMLElement = screen.getByText(/stop/i);
  const startButton: HTMLElement = screen.getByText(/start/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  stopButton.click();
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
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  startButton.click(); // => Planning
  toggleButton.click(); // => Working
  startButton.click(); // Nothing happened
  expect(statusElement).toHaveTextContent(STATES.working);
});

test('reset button doesn\'t change status from not working', () => {
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
  const toggleButton: HTMLElement = screen.getByText(/toggle/i);
  const statusElement: HTMLElement = screen.getByText(STATES.notWorking);
  startButton.click(); // => Planning
  toggleButton.click(); // => Working
  resetButton.click(); // => Not Working
  expect(statusElement).toHaveTextContent(STATES.notWorking);
});
