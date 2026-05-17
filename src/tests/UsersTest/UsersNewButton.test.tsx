import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { UsersNewButton } from '@/components/users/UsersNewButton'

const renderComponent = (onClick = jest.fn()) =>
  render(
    <MantineProvider>
      <UsersNewButton onClick={onClick} />
    </MantineProvider>
  )

describe('UsersNewButton', () => {
  it('renders the button label', () => {
    renderComponent()
    expect(screen.getByText('New User')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    renderComponent(onClick)
    fireEvent.click(screen.getByText('New User'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
