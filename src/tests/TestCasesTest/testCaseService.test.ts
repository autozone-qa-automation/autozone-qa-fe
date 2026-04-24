/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { apiService } from '@/services/api.service'
import { testCaseService } from '@/services/testCasesService'

jest.mock('@/services/api.service')

describe('testCaseService', () => {
  const mockTestCase = {
    id: 1,
    title: 'Valid Test',
    relatedFeature: 1,
    description: 'Desc',
    type: 'REGRESSION',
    preconditions: 'Pre',
    postconditions: 'Post',
    inputs: 'In',
    steps: 'Steps',
    expectedOutput: 'Out',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch and parse all test cases correctly', async () => {
    ;(apiService.get as jest.Mock).mockResolvedValue([mockTestCase])

    const result = await testCaseService.getAll()

    expect(() => apiService.get('/test-cases')).toBeDefined()

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(1)
  })

  it('should fail when the API returns invalid data according to Zod', async () => {
    ;(apiService.get as jest.Mock).mockResolvedValue([{ id: 1 }])

    await expect(testCaseService.getAll()).rejects.toThrow()
  })
})
