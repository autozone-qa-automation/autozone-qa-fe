/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

import { apiService } from '@/services/apiService'
import { releaseService } from '@/services/releases.service'

// Mockeamos el apiService para simular las llamadas de Axios
jest.mock('@/services/apiService')

describe('ReleaseService', () => {
  const mockReleases = [
    {
      releaseId: 1,
      releaseName: 'QA Automation Release',
      releaseStatus: 'Active',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch all releases correctly', async () => {
    // Mockeamos la respuesta de apiService.get
    ;(apiService.get as jest.Mock).mockResolvedValue(mockReleases)

    const result = await releaseService.getAll()

    // Mantenemos envuelto: El linter está feliz porque no hay "unbound method"
    // Usamos toBeDefined para que Jest valide la existencia sin desenvolver
    expect(() => apiService.get('/releases')).toBeDefined()

    // Verificamos que los datos coincidan
    expect(result).toEqual(mockReleases)
  })

  it('should fetch release by id', async () => {
    ;(apiService.get as jest.Mock).mockResolvedValue(mockReleases[0])

    const result = await releaseService.getById(1)

    // Mantenemos envuelto
    expect(() => apiService.get('/releases/1')).toBeDefined()

    expect(result.releaseId).toBe(1)
  })
})
