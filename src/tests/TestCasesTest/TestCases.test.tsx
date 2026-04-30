/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { useTestCases } from '@/hooks/useGetTestCases'
import { TestCaseVO } from '@/models/TestCaseVO'
import { TestCases } from '../../pages/tests-cases/TestCases'

jest.mock('@/hooks/useGetTestCases')

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
})
