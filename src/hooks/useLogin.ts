/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useState } from 'react'
import { ServiceError } from '@/models/errors/ServiceError'
import { UserVO } from '@/models/UserVO'
import { authService, type LoginRequest } from '@/services/auth.service'

interface UseLoginReturn {
  /** Login function accepting email/password credentials */
  login: (payload: LoginRequest) => Promise<UserVO | null>
  /** Loading state during authentication */
  isLoading: boolean
  /** Error message if authentication fails */
  error: string | null
}

/**
 * React Hook for managing user authentication (login).
 * @hook
 * @returns {UseLoginReturn} Object with login function, isLoading, and error state
 */
export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Executes login flow: authenticates user, persists token/profile, returns UserVO.
   *
   * @param payload - { email, password } credentials
   * @returns UserVO on success, null on error (error message in state)
   */
  const login = async (payload: LoginRequest): Promise<UserVO | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.login(payload)
      localStorage.setItem('authToken', res.token)
      localStorage.setItem('userEmail', res.user.email)
      localStorage.setItem('name', res.user.name)
      localStorage.setItem('sureName', res.user.lastName)
      if (res.user.rolePermission)
        localStorage.setItem('role', String(res.user.rolePermission.permission))
      return new UserVO(res.user)
    } catch (err: unknown) {
      let message = 'Login failed'
      if (err instanceof ServiceError) message = err.message
      else if (err instanceof Error) message = err.message
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
