/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { ReportVO } from '@/models/ReportVO'
import { reportsService } from '@/services/reports.service'

jest.mock('@/services/api.service', () => ({
  apiService: {
    get: jest.fn(),
  },
}))

//const mockedGet = jest.requireMock('@/services/api.service').apiService.get
//const mockedGet = (jest.requireMock('@/services/api.service') as { apiService: { get: jest.Mock } }).apiService.get
const apiServiceMock: { apiService: { get: jest.Mock } } =
  jest.requireMock('@/services/api.service')
const mockedGet = apiServiceMock.apiService.get

describe('reportsService', () => {
  const mockReport = {
    releaseId: 1,
    releaseName: 'Release 1.0',
    releaseDescription: 'Initial release',
    releaseVersion: '1.0.0',
    releaseStatus: 'Active',
    releaseTags: ['QA', 'Regression'],
    releaseCreationDate: '2026-01-01',
    releaseLaunchDate: '2026-01-10',
    services: [
      {
        serviceName: 'Auth Service',
        features: [
          {
            featureName: 'Login',
            testCases: ['Valid Login'],
          },
        ],
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return parsed reports', async () => {
      mockedGet.mockResolvedValue([mockReport])

      const result = await reportsService.getAll()

      expect(result).toHaveLength(1)
      expect(result[0]?.releaseId).toBe(1)

      expect(mockedGet).toHaveBeenCalledWith('/reports', {
        params: undefined,
      })
    })

    it('should pass filters to apiService', async () => {
      mockedGet.mockResolvedValue([mockReport])

      await reportsService.getAll({
        serviceId: 10,
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        tagName: 'QA',
      })

      expect(mockedGet).toHaveBeenCalledWith('/reports', {
        params: {
          serviceId: 10,
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          tagName: 'QA',
        },
      })
    })

    it('should throw when response does not match schema', async () => {
      mockedGet.mockResolvedValue([
        {
          invalid: true,
        },
      ])

      await expect(reportsService.getAll()).rejects.toThrow()
    })
  })

  describe('getAllVO', () => {
    it('should return ReportVO instances', async () => {
      mockedGet.mockResolvedValue([mockReport])

      const result = await reportsService.getAllVO()

      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(ReportVO)
    })

    it('should map multiple reports', async () => {
      mockedGet.mockResolvedValue([
        mockReport,
        {
          ...mockReport,
          releaseId: 2,
          releaseName: 'Release 2.0',
        },
      ])

      const result = await reportsService.getAllVO()

      expect(result).toHaveLength(2)
      expect(result[1]?.releaseId).toBe(2)
      expect(result[1]?.releaseName).toBe('Release 2.0')
    })
  })

  describe('exportCsv', () => {
    it('should call export endpoint and return blob', async () => {
      const blob = new Blob(['csv'])

      mockedGet.mockResolvedValue(blob)

      const result = await reportsService.exportCsv({
        releaseIds: '1,2,3',
      })

      expect(result).toBe(blob)

      expect(mockedGet).toHaveBeenCalledWith('/reports/export', {
        params: {
          releaseIds: '1,2,3',
        },
        responseType: 'blob',
      })
    })
  })
})
