import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer Component', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('renders all footer link sections', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /product/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /company/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /support/i })).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole('link', { name: /twitter|github|linkedin|discord/i });
    expect(socialLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('footer links have valid href attributes', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).not.toBe('');
    });
  });

  it('is accessible with proper landmark', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});