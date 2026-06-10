/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { UserDeleteModal } from '@/pages/users/UserDeleteModal'
import { userService } from '@/services/user.service'

jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))

interface NotificationsMock {
  notifications: { show: jest.Mock }
}

const mockNotificationsShow =
  jest.requireMock<NotificationsMock>('@mantine/notifications').notifications.show

const setup = (overrides: Partial<React.ComponentProps<typeof UserDeleteModal>> = {}) => {
  const onClose = jest.fn()
  const onSuccess = jest.fn()
  render(
    <MantineProvider>
      <UserDeleteModal
        isOpen={true}
        userId={42}
        userName="Samuel Lopez"
        onClose={onClose}
        onSuccess={onSuccess}
        {...overrides}
      />
    </MantineProvider>
  )
  return { onClose, onSuccess }
}

describe('UserDeleteModal', () => {
  let deactivateSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    deactivateSpy = jest.spyOn(userService, 'deactivate').mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders the Delete User title', () => {
    setup()
    expect(screen.getByText('Delete User')).toBeInTheDocument()
  })

  test('shows the full name of the user being deleted', () => {
    setup()
    expect(screen.getByText('Samuel Lopez')).toBeInTheDocument()
  })

  test('shows the irreversible action warning', () => {
    setup()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  test('does not render when isOpen is false', () => {
    setup({ isOpen: false })
    expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
  })

  test('cancel button calls onClose', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByTestId('delete-user-cancel-btn'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('confirm button calls userService.deactivate with the correct id', async () => {
    setup()
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))
    await waitFor(() => expect(deactivateSpy).toHaveBeenCalledWith(42))
  })

  test('calls onSuccess and onClose after successful deactivation', async () => {
    const { onClose, onSuccess } = setup()
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  test('shows a success notification after deactivation', async () => {
    setup()
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))
    await waitFor(() =>
      expect(mockNotificationsShow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'User deleted',
          color: 'teal',
        })
      )
    )
  })

  test('shows an error notification when deactivation fails', async () => {
    deactivateSpy.mockRejectedValue(new Error('User not found'))
    setup()
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))
    await waitFor(() =>
      expect(mockNotificationsShow).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          message: 'User not found',
        })
      )
    )
  })

  test('does not call onSuccess or onClose when deactivation fails', async () => {
    deactivateSpy.mockRejectedValue(new Error('Server error'))
    const { onClose, onSuccess } = setup()
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))
    await waitFor(() => expect(mockNotificationsShow).toHaveBeenCalled())
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  test('cancel button is disabled while the request is in progress', async () => {
    let resolveDeactivate!: () => void
    deactivateSpy.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          resolveDeactivate = resolve
        })
    )
    const { onClose } = setup()

    // Trigger the deletion to enter loading state
    fireEvent.click(screen.getByTestId('delete-user-confirm-btn'))

    // Button must be disabled during the in-flight request
    await waitFor(() => expect(screen.getByTestId('delete-user-cancel-btn')).toBeDisabled())

    // Resolve — onClose should be called once loading finishes
    resolveDeactivate()
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
