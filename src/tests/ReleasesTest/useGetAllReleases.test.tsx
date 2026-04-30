/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useGetAllReleases } from '@/hooks/useGetReleases'
import { releaseService } from '@/services/releases.service'

jest.mock('@/services/releases.service')

describe('useGetAllReleases Hook', () => {
  it('should fetch data successfully', async () => {
    const mockData = [
      {
        releaseId: 1,
        releaseName: 'Test',
        releaseDescription: 'Description',
        releaseCreationDate: '2026-04-30',
        releaseLaunchDate: null,
        releaseVersion: '1.0.0',
        releaseTags: ['tag'],
        releaseStatus: 'Active',
        releaseServices: ['Service'],
        releaseServiceId: 10,
        releaseFeatures: [],
      },
    ]
    ;(releaseService.getAll as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useGetAllReleases())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.releases).toEqual(mockData)
  })

  it('should handle database connection error', async () => {
    ;(releaseService.getAll as jest.Mock).mockRejectedValue(new Error('Unexpected error!'))

    const { result } = renderHook(() => useGetAllReleases())

    await waitFor(() => {
      expect(result.current.error).toContain('Unexpected error!')
    })
  })
})
