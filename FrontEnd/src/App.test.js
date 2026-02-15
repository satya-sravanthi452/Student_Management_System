import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Student Database Management heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Student Database Management/i);
  expect(headingElement).toBeInTheDocument();
});
