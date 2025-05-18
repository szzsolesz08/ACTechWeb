import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('App Integration Tests', () => {
  it('should render the application correctly', () => {
    render(<App />);
    
    // Verify main elements are present
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByAltText(/react logo/i)).toBeInTheDocument();
  });

  it('should update count when button is clicked', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Find the count button
    const button = screen.getByRole('button', { name: /count is/i });
    expect(button).toBeInTheDocument();
    
    // Get initial count
    const initialCount = button.textContent;
    
    // Click the button
    await user.click(button);
    
    // Verify count has increased
    expect(button.textContent).not.toBe(initialCount);
  });
});
