/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

//import type { User } from '@/types/user.types'
import type { User } from '@/types/user.types'
import { handleServiceError } from '@/utils/handleServiceError'
import { apiService } from './api.service'

const BASE_PATH = '/authentify'

export interface LoginRequest {
  mail: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  /**
   * Authenticates user and returns JWT token + user profile.
   *
   * TODO: Once backend completes, will return { token, user } object
   *
   * @param payload - { email, password } credentials
   * @returns Promise resolving to { token, user } on success
   * @throws ServiceError on API/validation failure
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      const data = await apiService.post<unknown>(`${BASE_PATH}`, payload)
      return data as LoginResponse
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },
}
