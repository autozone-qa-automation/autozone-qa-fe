/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { ReportFeatureVO, ReportServiceVO, ReportVO } from '@/models/ReportVO'
import type { Report } from '@/types/Report.types'

describe('ReportVO', () => {
  const mockReport: Report = {
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
        serviceName: 'Authentication Service',
        features: [
          {
            featureName: 'Login',
            testCases: ['Valid Login', 'Invalid Login'],
          },
        ],
      },
    ],
  }

  it('should create an instance with all properties', () => {
    const vo = new ReportVO(mockReport)

    expect(vo.releaseId).toBe(1)
    expect(vo.releaseName).toBe('Release 1.0')
    expect(vo.releaseDescription).toBe('Initial release')
    expect(vo.releaseVersion).toBe('1.0.0')
    expect(vo.releaseStatus).toBe('Active')
    expect(vo.releaseTags).toEqual(['QA', 'Regression'])
    expect(vo.releaseCreationDate).toBe('2026-01-01')
    expect(vo.releaseLaunchDate).toBe('2026-01-10')
  })

  it('should create nested ReportServiceVO instances', () => {
    const vo = new ReportVO(mockReport)

    expect(vo.services).toHaveLength(1)
    expect(vo.services[0]).toBeInstanceOf(ReportServiceVO)
    expect(vo.services[0]?.serviceName).toBe('Authentication Service')
  })

  it('should create nested ReportFeatureVO instances', () => {
    const vo = new ReportVO(mockReport)

    expect(vo.services[0]?.features).toHaveLength(1)
    expect(vo.services[0]?.features[0]).toBeInstanceOf(ReportFeatureVO)
    expect(vo.services[0]?.features[0]?.featureName).toBe('Login')
    expect(vo.services[0]?.features[0]?.testCases).toEqual(['Valid Login', 'Invalid Login'])
  })

  it('should return releaseName when calling getDisplayName', () => {
    const vo = new ReportVO(mockReport)

    expect(vo.getDisplayName()).toBe('Release 1.0')
  })

  it('should default releaseTags to empty array when undefined', () => {
    const vo = new ReportVO({
      ...mockReport,
      releaseTags: undefined as unknown as string[],
    })

    expect(vo.releaseTags).toEqual([])
  })

  it('should default services to empty array when undefined', () => {
    const vo = new ReportVO({
      ...mockReport,
      services: undefined as unknown as [],
    })

    expect(vo.services).toEqual([])
  })
})
