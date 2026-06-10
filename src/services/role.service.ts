/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { RoleResponse } from '@/types/user.types'
import { apiService } from './api.service'

class RoleService {
  private readonly BASE_PATH = '/roles'

  async getAll(): Promise<RoleResponse[]> {
    return apiService.get<RoleResponse[]>(this.BASE_PATH)
  }

  async getById(id: number): Promise<RoleResponse> {
    return apiService.get<RoleResponse>(`${this.BASE_PATH}/${id}`)
  }
}

export const roleService = new RoleService()
