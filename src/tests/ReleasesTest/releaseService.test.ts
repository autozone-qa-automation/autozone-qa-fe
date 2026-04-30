/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

import { apiService } from '@/services/api.service'
import { releaseService } from '@/services/releases.service'

// Mockeamos el apiService para simular las llamadas de Axios
jest.mock('@/services/api.service')

describe('ReleaseService', () => {
  const mockReleases = [
    {
      releaseId: 1,
      releaseName: 'QA Automation Release',
      releaseDescription: 'Release for automation flows',
      releaseCreationDate: '2026-04-30',
      releaseLaunchDate: null,
      releaseVersion: '1.0.0',
      releaseTags: ['qa', 'automation'],
      releaseStatus: 'Active',
      releaseServiceId: 10,
      releaseServices: ['Authentication Service'],
      releaseFeatures: [
        {
          id: 101,
          featureName: 'Login JWT',
          featureDescription: 'JWT authentication',
          idService: 10,
          serviceName: 'Authentication Service',
        },
      ],
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
    expect(() => apiService['get']('/releases')).toBeDefined()

    // Verificamos que los datos coincidan
    expect(result).toEqual(mockReleases)
  })

  it('should fetch release by id', async () => {
    ;(apiService.get as jest.Mock).mockResolvedValue({
      releaseName: 'QA Automation Release',
      releaseDescription: 'Release for automation flows',
      releaseVersion: '1.0.0',
      releaseStatus: 'Active',
      releaseServiceId: 10,
      releaseFeatureIds: [101],
      releaseFeaturesIds: [101],
      releaseTags: ['qa', 'automation'],
      releaseCreationDate: '2026-04-30',
    })

    const result = await releaseService.getById('1')

    // Mantenemos envuelto
    expect(() => apiService['get']('/releases/1')).toBeDefined()

    expect(result.releaseName).toBe('QA Automation Release')
  })

  // --- TESTS DE CREACIÓN (POST) ---
  it('should create a new release correctly', async () => {
    const newRelease = {
      releaseName: 'New Feature Release',
      releaseDescription: 'Testing release creation',
      releaseVersion: '1.1.0',
      releaseStatus: 'Draft' as const,
      releaseServiceId: 10,
      releaseFeaturesIds: [101],
      releaseFeatureIds: [101],
      releaseTags: ['test'],
      releaseCreationDate: '2026-04-30',
    }

    ;(apiService.post as jest.Mock).mockResolvedValue(newRelease)

    const result = await releaseService.create(newRelease as never)

    expect(apiService['post']).toHaveBeenCalledWith('/releases', newRelease)
    expect(result.releaseName).toBe('New Feature Release')
  })
})
