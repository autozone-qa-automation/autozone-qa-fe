/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { CreateServiceRequest, Service } from '../types/service.types'
import { serviceSchema } from '../types/service.types'
import { apiService } from './api.service'

const BASE_URL = '/services'

export const servicesService = {
  getAll: async (): Promise<Service[]> => {
    const data = await apiService.get<unknown>(BASE_URL)
    return serviceSchema.array().parse(data)
  },

  getById: async (id: number): Promise<Service> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
    return serviceSchema.parse(data)
  },

  create: async (payload: CreateServiceRequest): Promise<Service> => {
    const data = await apiService.post<unknown>(BASE_URL, payload)
    return serviceSchema.parse(data)
  },

  update: async (id: number, payload: Partial<CreateServiceRequest>): Promise<Service> => {
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
    return serviceSchema.parse(data)
  },

  remove: async (id: number): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`)
  },
}
