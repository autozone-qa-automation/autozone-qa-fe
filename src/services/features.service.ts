/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { CreateFeatureRequest, Feature } from '../types/feature.types'
import { featureSchema } from '../types/feature.types'
import { apiService } from './api.service'

const BASE_URL = '/features'

export const featureService = {
  getAll: async (): Promise<Feature[]> => {
    const data = await apiService.get<unknown>(BASE_URL)
    return featureSchema.array().parse(data)
  },

  getById: async (id: string): Promise<Feature> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
    return featureSchema.parse(data)
  },

  create: async (payload: CreateFeatureRequest): Promise<Feature> => {
    const data = await apiService.post<unknown>(BASE_URL, payload)
    return featureSchema.parse(data)
  },

  update: async (id: string, payload: Partial<CreateFeatureRequest>): Promise<Feature> => {
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
    return featureSchema.parse(data)
  },

  remove: async (id: string): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`)
  },
}
