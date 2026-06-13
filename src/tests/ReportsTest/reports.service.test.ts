import { apiService } from '@/services/api.service'
import { reportsService } from '@/services/reports.service'

jest.mock('@/services/api.service')

const getSpy = apiService['get'] as jest.Mock

describe('reportsService.exportCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe llamar al endpoint /reports/export con los releaseIds y responseType blob', async () => {
    const mockBlob = new Blob(['csv,data'], { type: 'text/csv' })
    getSpy.mockResolvedValue(mockBlob)

    const result = await reportsService.exportCsv({ releaseIds: '1,2,3' })

    expect(getSpy).toHaveBeenCalledWith('/reports/export', {
      params: { releaseIds: '1,2,3' },
      responseType: 'blob',
    })
    expect(result).toBe(mockBlob)
  })

  it('debe propagar el error cuando la petición falla', async () => {
    const error = new Error('Network error')
    getSpy.mockRejectedValue(error)

    await expect(reportsService.exportCsv({ releaseIds: '1' })).rejects.toThrow('Network error')
  })

  it('debe funcionar con un solo releaseId', async () => {
    getSpy.mockResolvedValue(new Blob())

    await reportsService.exportCsv({ releaseIds: '42' })

    expect(getSpy).toHaveBeenCalledWith('/reports/export', {
      params: { releaseIds: '42' },
      responseType: 'blob',
    })
  })
})
