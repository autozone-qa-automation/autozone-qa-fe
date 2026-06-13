import { apiService } from '../../services/api.service'
import { authService } from '../../services/auth.service'
import { handleServiceError } from '../../utils/handleServiceError'

jest.mock('../../services/api.service', () => ({
  apiService: {
    post: jest.fn(),
  },
}))

jest.mock('../../utils/handleServiceError', () => ({
  handleServiceError: jest.fn(),
}))

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should authenticate successfully when valid payload is passed and user is active', async () => {
      const mockPayload = { mail: 'test@example.com', password: 'password123' }
      const mockResponse = {
        token: 'fake-token',
        user: { isActive: true, email: 'test@example.com' },
      }

      ;(apiService.post as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authService.login(mockPayload)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(apiService.post as jest.Mock).toHaveBeenCalledWith('/authentify', mockPayload)
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error if the user is inactive', async () => {
      const mockPayload = { mail: 'test@example.com', password: 'password123' }
      const mockResponse = {
        token: 'test-token',
        user: { isActive: false, email: 'test@example.com' },
      }

      ;(apiService.post as jest.Mock).mockResolvedValue(mockResponse)

      const expectedError = new Error('User account is inactive. Please contact support.')

      ;(handleServiceError as unknown as jest.Mock).mockImplementation(err => {
        throw err
      })

      await expect(authService.login(mockPayload)).rejects.toThrow(
        'User account is inactive. Please contact support.'
      )

      expect(handleServiceError as unknown as jest.Mock).toHaveBeenCalledWith(expectedError)
    })

    it('should catch errors and pass them to handleServiceError', async () => {
      const mockPayload = { mail: 'test@example.com', password: 'password123' }
      const mockError = new Error('Network Error')

      ;(apiService.post as jest.Mock).mockRejectedValue(mockError)
      ;(handleServiceError as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Handled Error')
      })

      await expect(authService.login(mockPayload)).rejects.toThrow('Handled Error')

      expect(handleServiceError as unknown as jest.Mock).toHaveBeenCalledWith(mockError)
    })
  })
})
