import { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a custom render function that includes providers
function render(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui),
  };
}

// Re-export everything
export * from '@testing-library/react';
export { render, userEvent };
