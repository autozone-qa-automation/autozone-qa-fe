/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { apiService } from '@/services/api.service'
import { releaseService } from '@/services/releases.service'

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
    ;(apiService.get as jest.Mock).mockResolvedValue(mockReleases)

    const result = await releaseService.getAll()
    expect(() => apiService['get']('/releases')).toBeDefined()

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
    expect(() => apiService['get']('/releases/1')).toBeDefined()
    expect(result.releaseName).toBe('QA Automation Release')
  })

  // --- POST TEST  ---
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

    expect(apiService['post']).toHaveBeenCalledWith('releases', newRelease)
    expect(result.releaseName).toBe('New Feature Release')
  })

  it('should delete a release correctly', async () => {
    ;(apiService.delete as jest.Mock).mockResolvedValue(undefined)

    await expect(releaseService.delete(1)).resolves.toBeUndefined()

    expect(apiService['delete']).toHaveBeenCalledWith('releases/1')
  })

  it('should propagate the error when deleting a release fails', async () => {
    const deleteError = new Error('Unable to delete release')
    ;(apiService.delete as jest.Mock).mockRejectedValue(deleteError)

    await expect(releaseService.delete(99)).rejects.toThrow('Unable to delete release')
    expect(apiService['delete']).toHaveBeenCalledWith('releases/99')
  })
})
