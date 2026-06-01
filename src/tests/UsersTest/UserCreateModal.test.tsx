/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { UserCreateModal } from '@/pages/users/UserCreateModal'
import { roleService } from '@/services/role.service'
import { userService } from '@/services/user.service'

jest.mock('@/services/role.service')
jest.mock('@/services/user.service')
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed-password') }))
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const mockNotificationsShow = jest.requireMock('@mantine/notifications').notifications
  .show as jest.Mock

interface MockSelectProps {
  placeholder?: string
  value?: string | null
  onChange: (value: string) => void
  error?: React.ReactNode
  'data-testid'?: string
}

jest.mock('@mantine/core', () => {
  const original = jest.requireActual('@mantine/core')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    Select: ({ placeholder, value, onChange, error, 'data-testid': testId }: MockSelectProps) => (
      <>
        <input
          data-testid={testId ?? 'mock-select'}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
        />
        {error && <span>{error}</span>}
      </>
    ),
  }
})

const mockRoles = [
  { id: 1, permission: 'DEV' as const },
  { id: 2, permission: 'ADMIN' as const },
]

const setup = () =>
  render(
    <MantineProvider>
      <UserCreateModal />
    </MantineProvider>
  )

const openAndFill = async ({
  name = 'Santiago',
  lastName = 'Estrada',
  email = 's.estrada@autozone.com',
  password = 'mypassword',
  roleValue = '1',
} = {}) => {
  fireEvent.click(screen.getByTestId('user-create-open-btn'))
  await screen.findByTestId('user-create-form')
  fireEvent.change(screen.getByPlaceholderText('e.g. Santiago'), { target: { value: name } })
  fireEvent.change(screen.getByPlaceholderText('e.g. Estrada'), { target: { value: lastName } })
  fireEvent.change(screen.getByPlaceholderText('e.g. s.estrada@autozone.com'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByPlaceholderText('Min. 8 characters'), {
    target: { value: password },
  })
  fireEvent.change(screen.getByTestId('user-role-select'), { target: { value: roleValue } })
}

describe('UserCreateModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(roleService.getAll as jest.Mock).mockResolvedValue(mockRoles)
    ;(userService.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Santiago' })
  })

  test('empty form blocks submit and shows required field errors', async () => {
    setup()
    fireEvent.click(screen.getByTestId('user-create-open-btn'))
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-submit-btn'))
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(screen.getByText('Role is required')).toBeInTheDocument()
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userService.create as jest.Mock).not.toHaveBeenCalled()
  })

  test('invalid email shows email validation error', async () => {
    setup()
    await openAndFill({ email: 'notanemail' })
    fireEvent.click(screen.getByTestId('user-submit-btn'))
    await waitFor(() => expect(screen.getByText('Valid email required')).toBeInTheDocument())
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userService.create as jest.Mock).not.toHaveBeenCalled()
  })

  test('valid form sends hashed password and correct payload', async () => {
    setup()
    await openAndFill()
    fireEvent.click(screen.getByTestId('user-submit-btn'))
    await waitFor(() =>
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.create as jest.Mock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Santiago',
          lastName: 'Estrada',
          email: 's.estrada@autozone.com',
          password: 'hashed-password',
          roleId: 1,
          isActive: true,
        })
      )
    )
  })

  test('API error shows error notification with backend message', async () => {
    ;(userService.create as jest.Mock).mockRejectedValue(
      new Error('User with email s.estrada@testflow.io already exists')
    )
    setup()
    await openAndFill()
    fireEvent.click(screen.getByTestId('user-submit-btn'))
    await waitFor(() =>
      expect(mockNotificationsShow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          message: 'User with email s.estrada@testflow.io already exists',
        })
      )
    )
  })

  test('cancel button closes modal', async () => {
    setup()
    fireEvent.click(screen.getByTestId('user-create-open-btn'))
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-cancel-btn'))
    await waitFor(() => expect(screen.queryByTestId('user-create-form')).not.toBeInTheDocument())
  })

  test('onSuccess is called after a successful create', async () => {
    const onSuccess = jest.fn().mockResolvedValue(undefined)
    render(
      <MantineProvider>
        <UserCreateModal onSuccess={onSuccess} />
      </MantineProvider>
    )
    await openAndFill()
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })
})
