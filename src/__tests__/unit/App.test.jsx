import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('App Component', () => {
  it('renders Vite + React heading', () => {
    render(<App />);
    const headingElement = screen.getByText('Vite + React');
    expect(headingElement).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('count is 0');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('count is 1');
  });
});
