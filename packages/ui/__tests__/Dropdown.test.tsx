import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from '../src/components/Dropdown';

const items = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

describe('@workspace/ui Dropdown', () => {
  it('renders trigger button', () => {
    render(<Dropdown items={items} label="Select" />);
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(<Dropdown items={items} label="Select" />);

    await user.click(screen.getByRole('button', { name: /select/i }));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('selects an item', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Dropdown items={items} label="Select" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /select/i }));
    await user.click(screen.getByText('Option 2'));

    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<Dropdown items={items} label="Select" />);

    await user.click(screen.getByRole('button', { name: /select/i }));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Dropdown items={items} label="Select" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows selected value', () => {
    render(<Dropdown items={items} label="Select" value="opt2" />);
    expect(screen.getByRole('button')).toHaveTextContent('Option 2');
  });
});