/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { apiService } from '@/services/api.service'
import { featureService } from '@/services/features.service'

/**
 * MODULE MOCKING:
 * We tell Jest to replace the real `api.service` with a fake version.
 */
jest.mock('@/services/api.service')

const getSpy = apiService['get'] as jest.Mock
const putSpy = apiService['put'] as jest.Mock 

describe('featureService - Tests and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the features and call the correct endpoint', async () => {
    getSpy.mockResolvedValue([
      {
        id: 1,
        featureName: 'string',
        featureDescription: 'string',
        idService: 1,
        serviceName: 'string',
      },
    ])

    await featureService.getAll()

    expect(getSpy).toHaveBeenCalledWith('/features')
  })

  it('should throw a VALIDATION_ERROR if the API responds with malformed data', async () => {
    const malformedData = [{ id: 1 }]

    getSpy.mockResolvedValue(malformedData)

    try {
      await featureService.getAll()
    } catch (error) {
      const err = error as { type?: string }
      expect(err.type).toBe('VALIDATION_ERROR')
    }
  })

  it('should throw an API_ERROR if the network call fails', async () => {
    const mockAxiosError = {
      isAxiosError: true,
      response: { status: 404, data: { message: 'Not found' } },
      type: 'API_ERROR',
      status: 404,
    }

    getSpy.mockRejectedValue(mockAxiosError)

    try {
      await featureService.getAll()
    } catch (error) {
      const err = error as { type?: string; status?: number }
      expect(err.type).toBe('API_ERROR')
      expect(err.status).toBe(404)
    }
  })

  /**
   * Tests
   */

  describe('deactivate', () => {
    it('should call the correct endpoint and pass an empty payload object on success', async () => {
      putSpy.mockResolvedValue({})

      await featureService.deactivate('55')

      expect(putSpy).toHaveBeenCalledWith('/features/55/deactivate', {})
    })

    it('should throw an API_ERROR if the server fails during deactivation', async () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: { status: 500, data: { message: 'Internal Server Error' } },
        type: 'API_ERROR',
        status: 500,
      }
      putSpy.mockRejectedValue(mockAxiosError)

      try {
        await featureService.deactivate('55')
      } catch (error) {
        const err = error as { type?: string; status?: number }
        
        expect(err.type).toBe('API_ERROR')
        expect(err.status).toBe(500)
      }
    })
  })
})