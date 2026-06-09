import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/components/Input';

describe('@workspace/ui Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" id="name" />);

    const input = screen.getByLabelText('Name');
    await user.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });

  it('calls onChange handler', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Input label="Search" id="search" onChange={onChange} />);
    await user.type(screen.getByLabelText('Search'), 'test');

    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input label="Email" id="email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text', () => {
    render(<Input label="Password" id="password" helperText="Min 8 characters" />);
    expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Field" id="field" disabled />);
    expect(screen.getByLabelText('Field')).toBeDisabled();
  });

  it('supports different input types', () => {
    render(<Input label="Password" id="pwd" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('supports required attribute', () => {
    render(<Input label="Required" id="req" required />);
    expect(screen.getByLabelText('Required')).toBeRequired();
  });
});