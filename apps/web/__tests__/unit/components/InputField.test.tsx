/**
 * InputField — god node with 22 edges.
 * The primary form primitive used in every calculator. A broken onChange, a
 * dropped label, or a silent value binding regression breaks all calculators.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from '@/components/ui';

describe('InputField', () => {
  // ── Core contract: label, input element, and onChange ────────────────────

  it('renders the label text', () => {
    render(<InputField label="Loan Amount" value="" onChange={jest.fn()} />);
    expect(screen.getByText('Loan Amount')).toBeInTheDocument();
  });

  it('renders an input element', () => {
    render(<InputField label="Amount" value={100} onChange={jest.fn()} />);
    // Default type is "number" which has role spinbutton, not textbox
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('displays the current value in the input', () => {
    render(<InputField label="Rate" value={5.5} onChange={jest.fn()} />);
    expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
  });

  it('calls onChange with the typed value when user types', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<InputField label="Name" value="" type="text" onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'abc');

    expect(handleChange).toHaveBeenCalledTimes(3);
    // Each keystroke calls onChange with the current input value string
    expect(handleChange).toHaveBeenNthCalledWith(1, 'a');
    expect(handleChange).toHaveBeenNthCalledWith(2, 'b');
    expect(handleChange).toHaveBeenNthCalledWith(3, 'c');
  });

  it('calls onChange with the correct value for a single character', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <InputField
        label="Placeholder test"
        value=""
        type="text"
        placeholder="Enter text"
        onChange={handleChange}
      />
    );
    await user.type(screen.getByRole('textbox'), 'X');
    expect(handleChange).toHaveBeenCalledWith('X');
  });

  // ── type prop ─────────────────────────────────────────────────────────────

  it('defaults to type="number"', () => {
    render(<InputField label="Amount" value={0} onChange={jest.fn()} />);
    // number inputs don't have role="textbox", use getByLabelText instead
    const input = screen.getByLabelText(/amount/i);
    expect(input).toHaveAttribute('type', 'number');
  });

  it('accepts type="text"', () => {
    render(<InputField label="Name" value="" type="text" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('accepts type="password"', () => {
    const { container } = render(
      <InputField label="Secret" value="" type="password" onChange={jest.fn()} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  // ── placeholder ───────────────────────────────────────────────────────────

  it('applies placeholder when provided', () => {
    render(
      <InputField
        label="Email"
        value=""
        type="text"
        placeholder="you@example.com"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  // ── unit badge ───────────────────────────────────────────────────────────

  it('renders the unit in the label when provided', () => {
    render(<InputField label="Rate" value={5} unit="%" onChange={jest.fn()} />);
    expect(screen.getByText('(%)')).toBeInTheDocument();
  });

  it('does not render a unit badge when unit is omitted', () => {
    render(<InputField label="Rate" value={5} onChange={jest.fn()} />);
    expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument();
  });

  // ── disabled state ───────────────────────────────────────────────────────

  it('disables the input when disabled=true', () => {
    render(<InputField label="Read-only" value={42} disabled onChange={jest.fn()} />);
    const input = screen.getByLabelText(/read-only/i);
    expect(input).toBeDisabled();
  });

  it('does not call onChange when the input is disabled', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<InputField label="Locked" value={0} type="text" disabled onChange={handleChange} />);
    await user.type(screen.getByLabelText(/locked/i), '9');
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── min / max / step passthrough ─────────────────────────────────────────

  it('passes min, max, and step to the underlying input', () => {
    render(
      <InputField
        label="Percentage"
        value={50}
        onChange={jest.fn()}
        min={0}
        max={100}
        step={0.01}
      />
    );
    const input = screen.getByLabelText(/percentage/i);
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '0.01');
  });

  // ── Snapshot ──────────────────────────────────────────────────────────────

  it('matches snapshot with text type, placeholder, and unit', () => {
    const { container } = render(
      <InputField
        label="Interest Rate"
        value={6.5}
        unit="%"
        type="number"
        placeholder="e.g. 6.5"
        onChange={jest.fn()}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
