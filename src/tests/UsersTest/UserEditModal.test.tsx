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
import type { User } from '@/types/user.types'

jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))

/** Typed shape of the mocked @mantine/notifications module. */
interface NotificationsMock {
  notifications: { show: jest.Mock }
}

const mockNotificationsShow =
  jest.requireMock<NotificationsMock>('@mantine/notifications').notifications.show

/** Props accepted by the Mantine Select stub used in tests. */
interface MockSelectProps {
  placeholder?: string
  value?: string | null
  onChange: (value: string) => void
  error?: React.ReactNode
  'data-testid'?: string
}

jest.mock('@mantine/core', () => {
  const original = jest.requireActual<Record<string, unknown>>('@mantine/core')
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

/** User fixture pre-loaded into the modal for all edit-mode tests. */
const mockUser: User = {
  id: 42,
  name: 'Santiago',
  lastName: 'Estrada',
  email: 's.estrada@autozone.com',
  roleId: 1,
  isActive: true,
}

/**
 * Renders UserCreateModal in controlled edit mode.
 *
 * @param overrides - Optional prop overrides for specific test scenarios.
 * @returns `onClose` and `onSuccess` spies for use in assertions.
 */
const setup = (overrides: Partial<React.ComponentProps<typeof UserCreateModal>> = {}) => {
  const onClose = jest.fn()
  const onSuccess = jest.fn().mockResolvedValue(undefined)
  render(
    <MantineProvider>
      <UserCreateModal
        user={mockUser}
        showPassword={false}
        opened={true}
        onClose={onClose}
        onSuccess={onSuccess}
        {...overrides}
      />
    </MantineProvider>
  )
  return { onClose, onSuccess }
}

describe('UserCreateModal — edit mode', () => {
  let updateSpy!: jest.SpyInstance
  let createSpy!: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(roleService, 'getAll').mockResolvedValue(mockRoles)
    updateSpy = jest.spyOn(userService, 'update').mockResolvedValue({ ...mockUser })
    createSpy = jest.spyOn(userService, 'create')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('modal opens immediately and shows the form', async () => {
    setup()
    await screen.findByTestId('user-create-form')
    expect(screen.getByTestId('user-create-form')).toBeInTheDocument()
  })

  test('no trigger button is rendered in controlled mode', () => {
    setup()
    expect(screen.queryByTestId('user-create-open-btn')).not.toBeInTheDocument()
  })

  test('form is pre-filled with the user data', async () => {
    setup()
    await screen.findByTestId('user-create-form')
    expect(screen.getByTestId<HTMLInputElement>('user-name-input').value).toBe('Santiago')
    expect(screen.getByTestId<HTMLInputElement>('user-lastname-input').value).toBe('Estrada')
    expect(screen.getByTestId<HTMLInputElement>('user-email-input').value).toBe(
      's.estrada@autozone.com'
    )
  })

  test('password field is hidden when showPassword is false', async () => {
    setup()
    await screen.findByTestId('user-create-form')
    expect(screen.queryByTestId('user-password-input')).not.toBeInTheDocument()
  })

  test('submit button shows "Save Changes"', async () => {
    setup()
    await screen.findByTestId('user-create-form')
    expect(screen.getByTestId('user-submit-btn')).toHaveTextContent('Save Changes')
  })

  test('valid submit calls userService.update with correct payload', async () => {
    setup()
    await screen.findByTestId('user-create-form')

    fireEvent.change(screen.getByTestId('user-name-input'), { target: { value: 'Luis' } })
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() =>
      expect(updateSpy).toHaveBeenCalledWith(
        42,
        expect.objectContaining({
          name: 'Luis',
          lastName: 'Estrada',
          email: 's.estrada@autozone.com',
          roleId: 1,
          isActive: true,
        })
      )
    )
  })

  test('userService.create is never called in edit mode', async () => {
    setup()
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => expect(updateSpy).toHaveBeenCalled())
    expect(createSpy).not.toHaveBeenCalled()
  })

  test('onSuccess and onClose are called after a successful update', async () => {
    const { onClose, onSuccess } = setup()
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  test('API error shows error notification with the backend message', async () => {
    updateSpy.mockRejectedValue(new Error('User not found'))
    setup()
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() =>
      expect(mockNotificationsShow).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', message: 'User not found' })
      )
    )
  })

  test('empty name field blocks submit and shows validation error', async () => {
    setup()
    await screen.findByTestId('user-create-form')

    fireEvent.change(screen.getByTestId('user-name-input'), { target: { value: '' } })
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => expect(screen.getByText('Name is required')).toBeInTheDocument())
    expect(updateSpy).not.toHaveBeenCalled()
  })

  test('invalid email blocks submit and shows email validation error', async () => {
    setup()
    await screen.findByTestId('user-create-form')

    fireEvent.change(screen.getByTestId('user-email-input'), { target: { value: 'notanemail' } })
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => expect(screen.getByText('Valid email required')).toBeInTheDocument())
    expect(updateSpy).not.toHaveBeenCalled()
  })

  test('cancel button calls onClose', async () => {
    const { onClose } = setup()
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-cancel-btn'))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  test('onSuccess is called with no createdUser argument in edit mode', async () => {
    const { onSuccess } = setup()
    await screen.findByTestId('user-create-form')
    fireEvent.click(screen.getByTestId('user-submit-btn'))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    const callArgs = (onSuccess.mock.calls[0] as unknown[]) ?? []
    expect(callArgs).toHaveLength(0)
  })
})
