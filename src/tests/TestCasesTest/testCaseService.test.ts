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

  const mockCreatePayload = {
    title: 'Valid Test',
    relatedFeature: 1,
    description: 'Desc',
    type: 'REGRESSION' as const,
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
    ; (apiService.get as jest.Mock).mockResolvedValue([mockTestCase])

    const result = await testCaseService.getAll()

    expect(() => apiService.get('/test-cases')).toBeDefined()

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(1)
  })

  it('should fail when the API returns invalid data according to Zod', async () => {
    ; (apiService.get as jest.Mock).mockResolvedValue([{ id: 1 }])

    await expect(testCaseService.getAll()).rejects.toThrow()
  })

  describe('update', () => {
    const mockedPut = jest.fn()

    beforeEach(() => {
      ; (apiService as unknown as Record<string, jest.Mock>)['put'] = mockedPut
    })

    it('should call PUT with the correct endpoint and payload', async () => {
      mockedPut.mockResolvedValue(mockTestCase)

      await testCaseService.update(1, mockCreatePayload)

      expect(mockedPut).toHaveBeenCalledWith('/test-cases/1', mockCreatePayload)
    })

    it('should return the updated test case parsed correctly', async () => {
      const updatedTestCase = { ...mockTestCase, title: 'Updated Title' }
      mockedPut.mockResolvedValue(updatedTestCase)

      const result = await testCaseService.update(1, mockCreatePayload)

      expect(result.title).toBe('Updated Title')
      expect(result.id).toBe(1)
    })

    it('should fail when the API returns invalid data according to Zod', async () => {
      mockedPut.mockResolvedValue({ id: 'invalid' })

      await expect(testCaseService.update(1, mockCreatePayload)).rejects.toThrow()
    })

    it('should propagate API errors (e.g. 404, 409)', async () => {
      mockedPut.mockRejectedValue(new Error('404 Not Found'))

      await expect(testCaseService.update(999, mockCreatePayload)).rejects.toThrow('404 Not Found')
    })
  })

  describe('deactivate', () => {
    const mockedPut = jest.fn()

    beforeEach(() => {
      ; (apiService as unknown as Record<string, jest.Mock>)['put'] = mockedPut
    })

    it('should call PUT with the correct deactivate endpoint', async () => {
      mockedPut.mockResolvedValue(undefined)

      await testCaseService.deactivate(1)

      expect(mockedPut).toHaveBeenCalledWith('/test-cases/1/deactivate')
    })

    it('should propagate API errors', async () => {
      mockedPut.mockRejectedValue(new Error('404 Not Found'))

      await expect(testCaseService.deactivate(999)).rejects.toThrow('404 Not Found')
    })
  })
})
