import { act, renderHook } from '@testing-library/react'
import { useLogin } from '../../hooks/useLogin'
import { ServiceError } from '../../models/errors/ServiceError'
import { UserVO } from '../../models/UserVO'
import { authService } from '../../services/auth.service'

// Mock authService
jest.mock('../../services/auth.service', () => ({
  authService: {
    login: jest.fn(),
  },
}))

// Create a spy for localStorage
const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

describe('useLogin hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Estado inicial', () => {
    it('should initialize with isLoading false and error null', () => {
      const { result } = renderHook(() => useLogin())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Flujo de Éxito', () => {
    it('should login successfully, set localStorage and return UserVO', async () => {
      const mockLoginResponse = {
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'John',
          lastName: 'Doe',
          password: 'hashed-password',
          rolePermission: {
            id: 1,
            permission: 'ADMIN',
          },
          isActive: true,
        },
      }

      ;(authService.login as jest.Mock).mockResolvedValue(mockLoginResponse)

      const { result } = renderHook(() => useLogin())

      let response: UserVO | null = null

      // We wrap the login call in act since it updates state (isLoading, error)
      await act(async () => {
        response = await result.current.login({ mail: 'test@example.com', password: 'password123' })
      })

      // Verify authService.login was called correctly
      expect(authService.login).toHaveBeenCalledWith({
        mail: 'test@example.com',
        password: 'password123',
      })

      // Verify localStorage is updated correctly
      expect(setItemSpy).toHaveBeenCalledWith('authToken', 'fake-jwt-token')
      expect(setItemSpy).toHaveBeenCalledWith('userEmail', 'test@example.com')
      expect(setItemSpy).toHaveBeenCalledWith('name', 'John')
      expect(setItemSpy).toHaveBeenCalledWith('sureName', 'Doe')
      expect(setItemSpy).toHaveBeenCalledWith('role', 'ADMIN')

      // Verify it returns a UserVO instance
      expect(response).toBeInstanceOf(UserVO)
      expect((response as UserVO | null)?.email).toBe('test@example.com')

      // Verify final state
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should toggle isLoading state correctly during successful login', async () => {
      const mockLoginResponse = {
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'John',
          lastName: 'Doe',
          password: 'hashed-password',
          rolePermission: {
            id: 1,
            permission: 'ADMIN',
          },
          isActive: true,
        },
      }

      let resolveLogin: (value: typeof mockLoginResponse) => void
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve as (value: typeof mockLoginResponse) => void
      })
      ;(authService.login as jest.Mock).mockReturnValue(loginPromise)

      const { result } = renderHook(() => useLogin())

      expect(result.current.isLoading).toBe(false)

      let actPromise: Promise<UserVO | null>
      act(() => {
        actPromise = result.current.login({ mail: 'test@example.com', password: 'password123' })
      })

      // While login is processing, isLoading should be true
      expect(result.current.isLoading).toBe(true)

      // Resolve the login promise
      await act(async () => {
        resolveLogin!(mockLoginResponse)
        await actPromise
      })

      // After login finishes, isLoading should be false
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Flujo de Error', () => {
    it('should handle login error correctly and not set localStorage', async () => {
      const errorMessage = 'Invalid credentials'
      ;(authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useLogin())

      let response: UserVO | null = null

      await act(async () => {
        response = await result.current.login({
          mail: 'wrong@example.com',
          password: 'wrongpassword',
        })
      })

      // Verify error handling
      expect(response).toBeNull()
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)

      // Verify localStorage was not touched
      expect(setItemSpy).not.toHaveBeenCalled()
    })

    it('should handle ServiceError correctly', async () => {
      const errorMessage = 'API Service Error'
      ;(authService.login as jest.Mock).mockRejectedValue(
        new ServiceError('API_ERROR', errorMessage)
      )

      const { result } = renderHook(() => useLogin())

      await act(async () => {
        await result.current.login({ mail: 'wrong@example.com', password: 'wrongpassword' })
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })
  })
})
