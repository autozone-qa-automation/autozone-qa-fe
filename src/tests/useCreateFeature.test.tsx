/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { act, renderHook } from '@testing-library/react'
import { useCreateFeature } from '@/hooks/useCreateFeature'
import { featureService } from '@/services/features.service'

jest.mock('@/services/features.service', () => ({
  featureService: {
    create: jest.fn(),
  },
}))

describe('useCreateFeature Hook', () => {
  const mockFeatureRequest = {
    featureName: 'Test Feature',
    idService: 1,
    featureDescription: 'Description test',
  }

  const mockFeatureResponse = {
    id: 100,
    ...mockFeatureRequest,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe retornar el estado inicial correcto', () => {
    const { result } = renderHook(() => useCreateFeature())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.success).toBe(false)
    expect(typeof result.current.createFeature).toBe('function')
  })

  test('debe crear un feature exitosamente', async () => {
    ;(featureService.create as jest.Mock).mockResolvedValue(mockFeatureResponse)

    const { result } = renderHook(() => useCreateFeature())

    await act(async () => {
      await result.current.createFeature(mockFeatureRequest)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.success).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test('debe manejar el error cuando la petición falla', async () => {
    const errorMessage = 'API Error'
    ;(featureService.create as jest.Mock).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useCreateFeature())

    await act(async () => {
      await result.current.createFeature(mockFeatureRequest)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  test('debe manejar errores desconocidos', async () => {
    await Promise.resolve()
    ;(featureService.create as jest.Mock).mockRejectedValue('Fatal Error')

    const { result } = renderHook(() => useCreateFeature())

    await act(async () => {
      await result.current.createFeature(mockFeatureRequest)
    })

    expect(result.current.error).toBe('Error inesperado al crear el feature.')
  })
})
