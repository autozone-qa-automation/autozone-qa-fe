import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { UsersRoleFilter } from '@/components/users/UsersRoleFilter'

const options = [
  { value: 'ALL', label: 'All Users' },
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Developer' },
]

const renderComponent = (value = 'ALL', onChange = jest.fn()) =>
  render(
    <MantineProvider>
      <UsersRoleFilter data={options} value={value} onChange={onChange} />
    </MantineProvider>
  )

describe('UsersRoleFilter', () => {
  it('renders with the current selected value', () => {
    renderComponent('ALL')
    expect(screen.getByDisplayValue('All Users')).toBeInTheDocument()
  })

  it('renders with a non-default selected value', () => {
    renderComponent('1')
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument()
  })
})
