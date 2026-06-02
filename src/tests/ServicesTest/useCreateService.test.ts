/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { act, renderHook } from '@testing-library/react'
import { useCreateService } from '@/hooks/useCreateService'
import { servicesService } from '@/services/services.service'

jest.mock('@/services/services.service', () => ({
  servicesService: { create: jest.fn() },
}))

const mockRequest = {
  name: 'Payment API',
  urls: [{ nombre: 'Swagger', url: 'https://swagger.io' }],
}

const mockResponse = { id: 1, name: 'Payment API', urls: [] }

describe('useCreateService', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns correct initial state', () => {
    const { result } = renderHook(() => useCreateService())
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
    expect(typeof result.current.createService).toBe('function')
  })

  test('sets loading true during the call and false after', async () => {
    ;(servicesService.create as jest.Mock).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useCreateService())

    await act(async () => {
      await result.current.createService(mockRequest)
    })

    expect(result.current.loading).toBe(false)
  })

  test('sets success and clears error on a successful create', async () => {
    ;(servicesService.create as jest.Mock).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useCreateService())

    await act(async () => {
      await result.current.createService(mockRequest)
    })

    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test('returns the created service on success', async () => {
    ;(servicesService.create as jest.Mock).mockResolvedValue(mockResponse)
    const { result } = renderHook(() => useCreateService())

    let returned: unknown
    await act(async () => {
      returned = await result.current.createService(mockRequest)
    })

    expect(returned).toEqual(mockResponse)
  })

  test('sets error state and re-throws on API error', async () => {
    ;(servicesService.create as jest.Mock).mockRejectedValue(new Error('Service already exists'))
    const { result } = renderHook(() => useCreateService())

    await act(async () => {
      await expect(result.current.createService(mockRequest)).rejects.toThrow('Service already exists')
    })

    expect(result.current.error).toBe('Service already exists')
    expect(result.current.success).toBe(false)
  })

  test('sets fallback error message for non-Error throws', async () => {
    ;(servicesService.create as jest.Mock).mockRejectedValue('fatal')
    const { result } = renderHook(() => useCreateService())

    await act(async () => {
      await expect(result.current.createService(mockRequest)).rejects.toBe('fatal')
    })

    expect(result.current.error).toBe('Unexpected error creating service.')
  })
})
