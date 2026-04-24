/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { CreateTestCaseRequest } from '@/types/TestCases.types'
import { apiService } from './api.service'

class TestCaseService {
  private readonly BASE_PATH = '/test-cases'

  async create(data: CreateTestCaseRequest): Promise<void> {
    await apiService.post<void>(this.BASE_PATH, data)
  }
}

export const testCaseService = new TestCaseService()
export async function createTestCase(data: CreateTestCaseRequest): Promise<void> {
  await testCaseService.create(data)
}
