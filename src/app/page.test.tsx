import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  test('renders the heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', { name: /home/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders the welcome paragraph with emojis', () => {
    render(<HomePage />)
    const paragraph = screen.getByText(/welcome to the home page/i)
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent('🏠')
    expect(paragraph).toHaveTextContent('👉')
    expect(paragraph).toHaveTextContent('📊')
  })
})
