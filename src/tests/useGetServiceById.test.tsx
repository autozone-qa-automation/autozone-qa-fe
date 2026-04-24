/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { renderHook, waitFor } from '@testing-library/react'
import { useGetServiceById } from '../hooks/useGetServiceById'
import { featureService } from '../services/features.service'
import { servicesService } from '../services/services.service'

jest.mock('../services/services.service')
jest.mock('../services/features.service')

const mockedServices = jest.mocked(servicesService)
const mockedFeatures = jest.mocked(featureService)

const mockServiceSQL = {
  id: 16,
  name: 'AI',
  description: 'Entrenamiento de modelos',
}

const mockFeaturesSQL = [
  {
    id: 1,
    featureName: 'Gestión de usuarios',
    featureDescription: 'CRUD de usuarios',
    idService: 1,
  },
  {
    id: 2,
    featureName: 'Gestion de prueba',
    featureDescription: 'usuarios eso tilin',
    idService: 16,
  },
]

describe('Hook: useGetServiceById', () => {
  it('debe cargar el servicio y filtrar solo sus features correspondientes', async () => {
    mockedServices.getById.mockResolvedValue(mockServiceSQL)
    mockedFeatures.getAll.mockResolvedValue(mockFeaturesSQL)

    const { result } = renderHook(() => useGetServiceById(16))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.service?.name).toBe('AI')
    expect(result.current.features).toHaveLength(1)

    const feature = result.current.features[0]

    if (!feature) throw new Error('Feature no encontrada')

    expect(feature.featureName).toBe('Gestion de prueba')
    expect(result.current.error).toBeNull()
  })
})
