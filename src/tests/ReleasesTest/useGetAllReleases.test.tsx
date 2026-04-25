import { renderHook, waitFor } from '@testing-library/react'
import { useGetAllReleases } from '@/hooks/useGetReleases'
import { releaseService } from '@/services/releases.service'

jest.mock('@/services/releases.service')

describe('useGetAllReleases Hook', () => {
  it('should fetch data successfully', async () => {
    const mockData = [{ releaseId: 1, releaseName: 'Test' }]
    ;(releaseService.getAll as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useGetAllReleases())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.releases).toEqual(mockData)
  })

  it('should handle database connection error', async () => {
    ;(releaseService.getAll as jest.Mock).mockRejectedValue({ code: 'ERR_NETWORK' })

    const { result } = renderHook(() => useGetAllReleases())

    await waitFor(() => {
      expect(result.current.error).toContain('Unexpected error connecting to Spring Boot')
    })
  })
})
