import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

jest.mock('../components/Sidebar', () => {
  const MockSidebar = () => <div data-testid="sidebar" />;
  MockSidebar.displayName = 'MockSidebar';
  return MockSidebar;
});
jest.mock('../lib/Providers', () => {
  const MockProviders = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  );
  MockProviders.displayName = 'MockProviders';
  return MockProviders;
});

describe('RootLayout metadata', () => {
  it('has correct metadata', () => {
    expect(metadata.title).toBe('Dashboard App');
    expect(metadata.description).toBe('Responsive dashboard with sidebar');
  });
});

describe('RootLayout Component', () => {
  const TestChild = () => <div data-testid="test-child">Content</div>;

  it('renders the correct structure', () => {
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    const htmlElement = document.documentElement;
    expect(htmlElement).toBeInTheDocument();
    expect(htmlElement).toHaveAttribute('lang', 'en');

    const body = document.body;
    expect(body).toHaveClass('min-h-screen flex bg-gray-50');

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1 p-4 pt-[72px] md:pt-4');

    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
