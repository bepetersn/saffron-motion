import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

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

test('toggles button to working', () => {
  render(<App />);
  const statusElement: HTMLElement = screen.getByText(/planning/i);
  const buttonElement: HTMLElement = screen.getByText(/toggle/i);
  buttonElement.click();
  expect(statusElement).toHaveTextContent(/working/i);
});
