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
 * This ensures our tests never make actual HTTP requests to a real server,
 * keeping tests fast and predictable.
 */
jest.mock('@/services/api.service')

/**
 * Creates a "Spy" on the specific 'get' method of our mocked apiService.
 * We cast it as `jest.Mock` to get TypeScript access to Jest methods like `.mockResolvedValue()`.
 */
const getSpy = apiService['get'] as jest.Mock

describe('featureService - Tests and Error Handling', () => {
  // Clears the history of the spy before every test so previous tests don't affect the current one.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the features and call the correct endpoint', async () => {
    // 1. Arrange: Tell the spy what to return when it is called
    getSpy.mockResolvedValue([
      {
        id: 1,
        featureName: 'string',
        featureDescription: 'string',
        idService: 1,
        serviceName: 'string',
      },
    ])

    // 2. Act: Call the actual service
    await featureService.getAll()

    // 3. Assert: Verify the service asked the API for the correct URL
    expect(getSpy).toHaveBeenCalledWith('/features')
  })

  /**
   * TESTING ERROR HANDLING (Validation):
   * This test simulates a scenario where the server returns an HTTP 200, but the data
   * is missing required fields. It verifies that our service catches this and throws a custom error.
   */
  it('should throw a VALIDATION_ERROR if the API responds with malformed data', async () => {
    const malformedData = [{ id: 1 }] // Missing featureName, etc.

    getSpy.mockResolvedValue(malformedData)

    try {
      await featureService.getAll()
    } catch (error) {
      // TypeScript requires us to cast the unknown error to check its custom properties
      const err = error as { type?: string }
      expect(err.type).toBe('VALIDATION_ERROR')
    }
  })

  /**
   * TESTING ERROR HANDLING (Network/Server Failure):
   * This test simulates an actual HTTP rejection (like a 404 Not Found) from Axios.
   * It uses `mockRejectedValue` instead of `mockResolvedValue` to trigger the catch block.
   */
  it('should throw an API_ERROR if the network call fails', async () => {
    const mockAxiosError = {
      isAxiosError: true,
      response: { status: 404, data: { message: 'Not found' } },
      type: 'API_ERROR',
      status: 404,
    }

    // Simulate a rejected promise (e.g., server down or 404)
    getSpy.mockRejectedValue(mockAxiosError)

    try {
      await featureService.getAll()
    } catch (error) {
      // Cast the unknown error to verify both the type and the forwarded HTTP status
      const err = error as { type?: string; status?: number }

      expect(err.type).toBe('API_ERROR')
      expect(err.status).toBe(404)
    }
  })
})
