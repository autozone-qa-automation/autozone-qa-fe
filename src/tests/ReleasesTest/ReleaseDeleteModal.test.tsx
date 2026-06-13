/*
 * TecnolÃ³gico de Monterrey â€” Campus Chihuahua
 * Desarrollo e ImplantaciÃ³n de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useDeleteRelease } from '@/hooks/useDeleteRelease'
import { ReleaseDeleteModal } from '@/pages/releases/ReleaseDeleteModal'

jest.mock('@/hooks/useDeleteRelease')

const mockedUseDeleteRelease = useDeleteRelease as jest.MockedFunction<typeof useDeleteRelease>

const setup = (overrides: Partial<React.ComponentProps<typeof ReleaseDeleteModal>> = {}) => {
  const onClose = jest.fn()
  const onSuccess = jest.fn()

  render(
    <MantineProvider>
      <ReleaseDeleteModal
        isOpen={true}
        releaseId={42}
        releaseName="Release Candidate 1.2.0"
        onClose={onClose}
        onSuccess={onSuccess}
        {...overrides}
      />
    </MantineProvider>
  )

  return { onClose, onSuccess }
}

describe('ReleaseDeleteModal', () => {
  const deleteReleaseStatus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseDeleteRelease.mockReturnValue({
      deleteReleaseStatus,
      loading: false,
    })
  })

  test('renders the Delete Release title', () => {
    setup()

    expect(screen.getByText('Delete Release')).toBeInTheDocument()
  })

  test('shows the release name being deleted', () => {
    setup()

    expect(screen.getByText('Release Candidate 1.2.0')).toBeInTheDocument()
  })

  test('shows the irreversible action warning', () => {
    setup()

    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  test('does not render when isOpen is false', () => {
    setup({ isOpen: false })

    expect(screen.queryByText('Delete Release')).not.toBeInTheDocument()
  })

  test('cancel button calls onClose', () => {
    const { onClose } = setup()

    fireEvent.click(screen.getByTestId('delete-release-cancel-btn'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('confirm button calls deleteReleaseStatus with the correct id', async () => {
    deleteReleaseStatus.mockResolvedValue(undefined)
    setup()

    fireEvent.click(screen.getByTestId('delete-release-confirm-btn'))

    await waitFor(() => expect(deleteReleaseStatus).toHaveBeenCalledWith(42))
  })

  test('calls onSuccess and onClose after successful deletion', async () => {
    deleteReleaseStatus.mockResolvedValue(undefined)
    const { onClose, onSuccess } = setup()

    fireEvent.click(screen.getByTestId('delete-release-confirm-btn'))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  test('cancel button is disabled while the request is in progress', async () => {
    let resolveDelete!: () => void
    deleteReleaseStatus.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          resolveDelete = resolve
        })
    )

    const { onClose } = setup()

    fireEvent.click(screen.getByTestId('delete-release-confirm-btn'))

    await waitFor(() => expect(screen.getByTestId('delete-release-cancel-btn')).toBeDisabled())

    resolveDelete()

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
