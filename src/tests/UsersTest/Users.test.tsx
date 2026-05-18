import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { useGetAllUsers } from '@/hooks/userGetUsers'
import { Users } from '@/pages/users/Users'
import type { User } from '@/types/user.types'

jest.mock('@/hooks/userGetUsers')

jest.mock('@/components/users/UsersRoleFilter', () => ({
  UsersRoleFilter: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select data-testid="role-filter" value={value} onChange={e => onChange(e.target.value)}>
      <option value="ALL">All Users</option>
      <option value="1">Admin</option>
      <option value="2">Developer</option>
      <option value="4">Read-Only</option>
    </select>
  ),
}))

jest.mock('@/pages/users/UserCreateModal', () => ({
  UserCreateModal: () => <button>New User</button>,
}))

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Samuel',
    lastName: 'Lopez',
    email: 'samuel@autozone.com',
    roleId: 1,
    isActive: true,
    rolePermission: { id: 1, permission: 'ADMIN' },
  },
  {
    id: 2,
    name: 'Andrea',
    lastName: 'Martinez',
    email: 'andrea@autozone.com',
    roleId: 2,
    isActive: true,
    rolePermission: { id: 2, permission: 'DEV' },
  },
  {
    id: 3,
    name: 'Carlos',
    lastName: 'Reyes',
    email: 'carlos@autozone.com',
    roleId: 2,
    isActive: true,
    rolePermission: { id: 2, permission: 'DEV' },
  },
  {
    id: 4,
    name: 'Laura',
    lastName: 'Gonzalez',
    email: 'laura@autozone.com',
    roleId: 4,
    isActive: true,
    rolePermission: { id: 4, permission: 'READ_ONLY' },
  },
  {
    id: 5,
    name: 'Diego',
    lastName: 'Torres',
    email: 'diego@autozone.com',
    roleId: 2,
    isActive: true,
    rolePermission: { id: 2, permission: 'DEV' },
  },
]

const mockUseGetAllUsers = (overrides = {}) =>
  jest.mocked(useGetAllUsers).mockReturnValue({
    users: mockUsers,
    loading: false,
    error: null,
    refetch: jest.fn(async () => {}),
    ...overrides,
  })

const renderComponent = () =>
  render(
    <MantineProvider>
      <Users />
    </MantineProvider>
  )

describe('Users page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetAllUsers()
  })

  it('renders the page title', () => {
    renderComponent()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows the total user count on load', () => {
    renderComponent()
    expect(screen.getByText('5 users')).toBeInTheDocument()
  })

  it('renders all users on load', () => {
    renderComponent()
    expect(screen.getByText('Samuel Lopez')).toBeInTheDocument()
    expect(screen.getByText('Andrea Martinez')).toBeInTheDocument()
    expect(screen.getByText('Carlos Reyes')).toBeInTheDocument()
    expect(screen.getByText('Laura Gonzalez')).toBeInTheDocument()
    expect(screen.getByText('Diego Torres')).toBeInTheDocument()
  })

  it('filters users by role when a role is selected', () => {
    renderComponent()
    fireEvent.change(screen.getByTestId('role-filter'), { target: { value: '1' } })
    expect(screen.getByText('Samuel Lopez')).toBeInTheDocument()
    expect(screen.queryByText('Andrea Martinez')).not.toBeInTheDocument()
    expect(screen.getByText('1 users')).toBeInTheDocument()
  })

  it('shows all users again when All Users is selected', () => {
    renderComponent()
    fireEvent.change(screen.getByTestId('role-filter'), { target: { value: '1' } })
    fireEvent.change(screen.getByTestId('role-filter'), { target: { value: 'ALL' } })
    expect(screen.getByText('5 users')).toBeInTheDocument()
  })

  it('shows loading state while fetching', () => {
    mockUseGetAllUsers({ loading: true, users: [] })
    renderComponent()
    expect(screen.getByText('Connecting to database...')).toBeInTheDocument()
  })

  it('still renders the page when fetch fails', () => {
    mockUseGetAllUsers({ error: 'Network Error', users: [] })
    renderComponent()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('0 users')).toBeInTheDocument()
  })
})
