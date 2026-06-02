/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { MantineProvider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useTestCases } from '@/hooks/useGetTestCases'
import { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'
import { TestCases } from '../../pages/tests-cases/TestCases'

jest.mock('@/hooks/useGetTestCases')
jest.mock('@/services/testCasesService', () => ({
  testCaseService: {
    deactivate: jest.fn(),
  },
}))
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
  showNotification: jest.fn(),
}))

const mockTestCases = [
  new TestCaseVO({
    id: 1,
    title: 'Auth Case',
    relatedFeature: 10,
    description: 'Desc',
    type: 'REGRESSION',
    preconditions: 'Pre',
    postconditions: 'Post',
    inputs: 'In',
    steps: 'Steps',
    expectedOutput: 'Out',
    featureName: 'Login',
  }),
]

const renderComponent = () =>
  render(
    <MantineProvider>
      <TestCases />
    </MantineProvider>
  )

describe('TestCases Component UI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(testCaseService.deactivate).mockResolvedValue(undefined)
  })

  it('should render the list of test cases correctly', () => {
    jest.mocked(useTestCases).mockReturnValue({
      testCases: mockTestCases,
      isLoading: false,
      error: null,
      refetch: jest.fn(async () => {}),
    })

    renderComponent()
    expect(screen.getByText('Auth Case')).toBeInTheDocument()
  })

  it('should open the modal when clicking the View button', async () => {
    jest.mocked(useTestCases).mockReturnValue({
      testCases: mockTestCases,
      isLoading: false,
      error: null,
      refetch: jest.fn(async () => {}),
    })

    renderComponent()

    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0]!)

    const modalTitle = await screen.findByText('Auth Case')
    expect(modalTitle).toBeInTheDocument()
  })

  it('should deactivate the test case and show the success notification', async () => {
    const refetch = jest.fn(async () => {})
    jest.mocked(useTestCases).mockReturnValue({
      testCases: mockTestCases,
      isLoading: false,
      error: null,
      refetch,
    })

    renderComponent()

    fireEvent.click(screen.getAllByText('View')[0]!)
    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(testCaseService.deactivate).toHaveBeenCalledWith(1)
    })

    expect(notifications.show).toHaveBeenCalledWith({
      title: '¡Éxito!',
      message: 'Test case eliminado correctamente',
      color: 'green',
    })
    expect(refetch).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No test cases available')).toBeInTheDocument()
  })
})
