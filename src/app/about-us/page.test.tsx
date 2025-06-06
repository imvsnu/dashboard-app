import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUsPage from './page';

describe('AboutUsPage', () => {
  it('renders the heading', () => {
    render(<AboutUsPage />);
    const heading = screen.getByRole('heading', { name: /about us/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl');
  });

  it('renders the description paragraph', () => {
    render(<AboutUsPage />);
    const paragraph = screen.getByText(/dashboard app is a simple web app/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('text-gray-600');
  });

  it('contains keywords: React, Redux, Tailwind CSS', () => {
    render(<AboutUsPage />);
    expect(screen.getByText(/React/)).toBeInTheDocument();
    expect(screen.getByText(/Redux/)).toBeInTheDocument();
    expect(screen.getByText(/Tailwind CSS/)).toBeInTheDocument();
  });
});
