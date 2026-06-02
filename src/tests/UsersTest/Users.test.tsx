/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useGetAllUsers } from '@/hooks/userGetUsers'
import { UserCreateModal } from '@/pages/users/UserCreateModal'
import { Users } from '@/pages/users/Users'
import type { User, UserResponse } from '@/types/user.types'

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
  UserCreateModal: jest.fn(
    ({
      user,
      opened,
      onClose,
    }: {
      onSuccess?: () => void
      user?: User
      opened?: boolean
      onClose?: () => void
    }) =>
      user && opened ? (
        <div data-testid="edit-modal">
          <button data-testid="edit-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <button data-testid="new-user-btn">New User</button>
      )
  ),
}))

jest.mock('@/pages/users/UserDeleteModal', () => ({
  UserDeleteModal: ({
    isOpen,
    userName,
    onClose,
    onSuccess,
  }: {
    isOpen: boolean
    userName: string
    onClose: () => void
    onSuccess?: () => void
  }) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <span>{`Delete ${userName}`}</span>
        <button data-testid="delete-confirm-btn" onClick={onSuccess}>
          Confirm
        </button>
        <button data-testid="delete-cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    ) : null,
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
    addUser: jest.fn(),
    removeUser: jest.fn(),
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

  it('does not render inactive users', () => {
    mockUseGetAllUsers({
      users: [
        ...mockUsers,
        {
          id: 99,
          name: 'Inactive',
          lastName: 'User',
          email: 'inactive@autozone.com',
          roleId: 1,
          isActive: false,
          rolePermission: { id: 1, permission: 'ADMIN' },
        },
      ],
    })
    renderComponent()
    expect(screen.queryByText('Inactive User')).not.toBeInTheDocument()
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

  describe('create user', () => {
    it('calls addUser when the create modal onSuccess fires with a created user', async () => {
      const addUser = jest.fn()
      mockUseGetAllUsers({ addUser })
      renderComponent()

      const MockModal = jest.mocked(UserCreateModal)
      const createCall = MockModal.mock.calls.find(([props]) => !props.user)
      const onSuccess = createCall?.[0]?.onSuccess
      const newUser = mockUsers[0] as UserResponse

      await act(async () => {
        await onSuccess?.(newUser)
      })

      expect(addUser).toHaveBeenCalledWith(newUser)
    })
  })

  describe('delete user', () => {
    it('opens the delete modal when a user row delete button is clicked', () => {
      renderComponent()
      fireEvent.click(screen.getAllByText('Delete')[0]!)
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument()
    })

    it('shows the full name of the user being deleted', () => {
      renderComponent()
      fireEvent.click(screen.getAllByText('Delete')[0]!)
      expect(screen.getByText('Delete Samuel Lopez')).toBeInTheDocument()
    })

    it('closes the delete modal when cancel is clicked', () => {
      renderComponent()
      fireEvent.click(screen.getAllByText('Delete')[0]!)
      fireEvent.click(screen.getByTestId('delete-cancel-btn'))
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument()
    })

    it('calls removeUser after the delete modal confirms successfully', async () => {
      const removeUser = jest.fn()
      mockUseGetAllUsers({ removeUser })
      renderComponent()
      fireEvent.click(screen.getAllByText('Delete')[0]!)
      fireEvent.click(screen.getByTestId('delete-confirm-btn'))
      await waitFor(() => expect(removeUser).toHaveBeenCalledWith(mockUsers[0]!.id))
    })
  })

  describe('edit user', () => {
    it('opens the edit modal when a user row edit button is clicked', async () => {
      renderComponent()
      fireEvent.click(screen.getAllByText('Edit')[0]!)
      await waitFor(() => expect(screen.getByTestId('edit-modal')).toBeInTheDocument())
    })

    it('closes the edit modal when onClose is called', async () => {
      renderComponent()
      fireEvent.click(screen.getAllByText('Edit')[0]!)
      await screen.findByTestId('edit-modal')
      fireEvent.click(screen.getByTestId('edit-modal-close'))
      await waitFor(() => expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument())
    })
  })
})
