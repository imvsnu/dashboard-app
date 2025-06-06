import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders dashboard title', () => {
    render(<Sidebar />);
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('highlights active nav item based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/data');
    render(<Sidebar />);
    const dataLink = screen.getByText('Data').closest('a');
    expect(dataLink).toHaveClass('bg-blue-100');
  });
});
