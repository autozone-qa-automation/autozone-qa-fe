/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useReports } from '@/hooks/useReports'
import { ReportVO } from '@/models/ReportVO'
import { reportsService } from '@/services/reports.service'

jest.mock('@/services/reports.service', () => ({
  reportsService: {
    getAllVO: jest.fn(),
    exportCsv: jest.fn(),
  },
}))

jest.mock('@/hooks/useGetServices', () => ({
  useGetServices: () => ({
    services: [],
  }),
}))

const mockedGetAllVO = jest.mocked(reportsService.getAllVO)

describe('useReports Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe cargar reportes al iniciar', async () => {
    mockedGetAllVO.mockResolvedValue([
      new ReportVO({
        releaseId: 1,
        releaseName: 'Release 1',
        releaseDescription: 'Description',
        releaseVersion: '1.0.0',
        releaseStatus: 'Active',
        releaseTags: ['Smoke'],
        releaseCreationDate: '2026-01-01',
        releaseLaunchDate: null,
        services: [],
      }),
    ])

    const { result } = renderHook(() => useReports())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockedGetAllVO).toHaveBeenCalledTimes(1)

    expect(result.current.reports).toHaveLength(1)

    expect(result.current.reports[0]?.releaseName).toBe('Release 1')
  })
})
