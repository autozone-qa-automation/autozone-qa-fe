/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { CreateTestCaseRequest, TestCase } from '@/types/testcase.types'
import { testCaseSchema } from '@/types/testcase.types'
import { apiService } from './api.service'

const BASE_URL = '/test-cases'

export const testCaseService = {
  getAll: async (): Promise<TestCase[]> => {
    const data = await apiService.get<unknown>(BASE_URL)

    return testCaseSchema.array().parse(data)
  },

  getById: async (id: number): Promise<TestCase> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
    return testCaseSchema.parse(data)
  },

  getByFeatureId: async (id: number): Promise<TestCase[]> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/feature/${id}`)
    return testCaseSchema.array().parse(data)
  },

  create: async (payload: CreateTestCaseRequest): Promise<TestCase> => {
    const data = await apiService.post<unknown>(BASE_URL, payload)
    return testCaseSchema.parse(data)
  },

  update: async (id: number, payload: Partial<CreateTestCaseRequest>): Promise<TestCase> => {
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
    return testCaseSchema.parse(data)
  },

  remove: async (id: number): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`)
  },
}
