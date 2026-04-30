/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useTestCases } from '@/hooks/useGetTestCases'
import { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'

jest.mock('@/services/testCasesService')

describe('useTestCases Hook', () => {
  const mockData = [
    {
      id: 1,
      title: 'Hook Test',
      relatedFeature: 1,
      description: 'Desc',
      type: 'REGRESSION',
      preconditions: 'Pre',
      postconditions: 'Post',
      inputs: 'In',
      steps: 'Steps',
      expectedOutput: 'Out',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch data and convert to Value Objects', async () => {
    const mockedGetAll = jest.mocked(testCaseService.getAll)
    mockedGetAll.mockResolvedValue(mockData)

    const { result } = renderHook(() => useTestCases())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.testCases[0]).toBeInstanceOf(TestCaseVO)
    expect(result.current.testCases[0]?.title).toBe('Hook Test')
    expect(result.current.error).toBeNull()
  })

  it('should catch and store errors from the service', async () => {
    const errorMsg = 'Failed to fetch'
    jest.mocked(testCaseService.getAll).mockRejectedValue(new Error(errorMsg))

    const { result } = renderHook(() => useTestCases())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMsg)
  })
})
