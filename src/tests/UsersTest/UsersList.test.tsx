import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { UsersList } from '@/components/users/UsersList'
import type { User } from '@/types/user.types'

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Samuel',
    lastName: 'Lopez',
    email: 'samuel@autozone.com',
    roleId: 1,
    role: { idRole: 1, permisionlevel: 'Admin' },
  },
  {
    id: 2,
    name: 'Andrea',
    lastName: 'Martinez',
    email: 'andrea@autozone.com',
    roleId: 2,
    role: { idRole: 2, permisionlevel: 'Developer' },
  },
]

const renderComponent = (props = {}) =>
  render(
    <MantineProvider>
      <UsersList data={mockUsers} {...props} />
    </MantineProvider>
  )

describe('UsersList', () => {
  it('renders a row for each user', () => {
    renderComponent()
    expect(screen.getByText('Samuel Lopez')).toBeInTheDocument()
    expect(screen.getByText('Andrea Martinez')).toBeInTheDocument()
  })

  it('renders zero-padded IDs', () => {
    renderComponent()
    expect(screen.getByText('001')).toBeInTheDocument()
    expect(screen.getByText('002')).toBeInTheDocument()
  })

  it('renders role badges', () => {
    renderComponent()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })

  it('renders user emails', () => {
    renderComponent()
    expect(screen.getByText('samuel@autozone.com')).toBeInTheDocument()
  })

  it('calls onEditClick with the correct user when Edit is clicked', () => {
    const onEditClick = jest.fn()
    renderComponent({ onEditClick })
    fireEvent.click(screen.getAllByText('Edit')[0]!)
    expect(onEditClick).toHaveBeenCalledWith(mockUsers[0])
  })

  it('calls onDeleteClick with the correct user when Delete is clicked', () => {
    const onDeleteClick = jest.fn()
    renderComponent({ onDeleteClick })
    fireEvent.click(screen.getAllByText('Delete')[0]!)
    expect(onDeleteClick).toHaveBeenCalledWith(mockUsers[0])
  })

  it('renders nothing in the body when data is empty', () => {
    render(
      <MantineProvider>
        <UsersList data={[]} />
      </MantineProvider>
    )
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })
})
