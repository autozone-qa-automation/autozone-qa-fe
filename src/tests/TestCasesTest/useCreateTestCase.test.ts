/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { act, renderHook } from '@testing-library/react'
import { useTestCases } from '@/hooks/useCreateTestCase'
import { createTestCase } from '@/services/TestCaseService'

jest.mock('@/services/TestCaseService', () => ({
  createTestCase: jest.fn(),
}))

const mockedCreateTestCase = createTestCase as jest.MockedFunction<typeof createTestCase>

const mockRequest = {
  title: 'Login',
  relatedFeature: 3,
  description: '',
  preconditions: '',
  inputs: '',
  steps: 'Steps',
  postconditions: '',
  expectedOutput: 'Output',
  type: 'REGRESSION' as const,
}

describe('useTestCases Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe retornar true cuando la creación es exitosa', async () => {
    mockedCreateTestCase.mockResolvedValue(undefined)
    const { result } = renderHook(() => useTestCases())

    let returned: boolean | undefined
    await act(async () => {
      returned = await result.current.create(mockRequest)
    })

    expect(returned).toBe(true)
  })

  test('debe activar loading durante la petición', async () => {
    let resolvePromise!: (value: void | PromiseLike<void>) => void
    const pending = new Promise<void>(res => {
      resolvePromise = res
    })
    mockedCreateTestCase.mockReturnValue(pending)

    const { result } = renderHook(() => useTestCases())
    let createPromise: Promise<boolean>
    await act(async () => {
      createPromise = result.current.create(mockRequest)
      await Promise.resolve()
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolvePromise()
      await createPromise
    })
    expect(result.current.loading).toBe(false)
  })

  test('debe resetear error a null antes de cada nuevo intento', async () => {
    mockedCreateTestCase.mockRejectedValueOnce(new Error('Error'))
    const { result } = renderHook(() => useTestCases())

    await act(async () => {
      await result.current.create(mockRequest)
    })
    expect(result.current.error).toBe('Error')

    mockedCreateTestCase.mockResolvedValueOnce(undefined)

    await act(async () => {
      await result.current.create(mockRequest)
    })
    expect(result.current.error).toBeNull()
  })
})
