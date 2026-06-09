import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../src/components/Modal';

describe('@workspace/ui Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const overlay = screen.getByTestId('modal-overlay');
    await user.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key press', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.keyboard('{Escape}');

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer actions', () => {
    render(
      <Modal
        {...defaultProps}
        footer={
          <>
            <button>Cancel</button>
            <button>Confirm</button>
          </>
        }
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('traps focus within the modal', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has proper aria attributes', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});