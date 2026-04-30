/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useFeatureFormResources } from '@/hooks/useFeatureFormResources'
import { servicesService } from '../services/services.service'

jest.mock('../services/services.service', () => ({
  servicesService: {
    getAll: jest.fn(),
  },
}))

describe('useFeatureFormResources Hook', () => {
  const mockServicesData = [
    { id: 1, name: 'Service A' },
    { id: 2, name: 'Service B' },
    { id: 3, name: null },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe retornar el estado inicial de carga', () => {
    ;(servicesService.getAll as jest.Mock).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useFeatureFormResources())

    expect(result.current.loading).toBe(true)
    expect(result.current.servicesOptions).toEqual([])
    expect(result.current.error).toBeNull()
  })

  test('debe cargar y formatear los servicios correctamente', async () => {
    ;(servicesService.getAll as jest.Mock).mockResolvedValue(mockServicesData)

    const { result } = renderHook(() => useFeatureFormResources())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.servicesOptions).toEqual([
      { value: '1', label: 'Service A' },
      { value: '2', label: 'Service B' },
      { value: '3', label: 'Unknown Service' },
    ])
    expect(result.current.error).toBeNull()
  })

  test('debe manejar errores cuando el servicio falla', async () => {
    const errorMessage = 'Network Error'
    ;(servicesService.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useFeatureFormResources())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.servicesOptions).toEqual([])
  })

  test('debe manejar errores genéricos si no hay instancia de Error', async () => {
    ;(servicesService.getAll as jest.Mock).mockRejectedValue('String error')

    const { result } = renderHook(() => useFeatureFormResources())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Error loading services')
  })
})
