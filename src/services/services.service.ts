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

/**
 * HTTP service layer for the /services resource.
 * Handles requests and validates responses with Zod.
 */
export const servicesService = {
  /**
   * @function getAll - Fetches all services
   * @returns Array of Service objects
   */
  getAll: async (): Promise<Service[]> => {
    const data = await apiService.get<unknown>(BASE_URL)
    return serviceSchema.array().parse(data)
  },

  /**
   * @function getById - Fetches a single service by id
   * @param id - Id of the service to fetch
   * @returns The matching Service object
   */
  getById: async (id: number): Promise<Service> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
    return serviceSchema.parse(data)
  },

  /**
   * @function create - Creates a new service
   * @param payload - Service data to send to the backend
   * @returns The newly created Service object
   */
  create: async (payload: CreateServiceRequest): Promise<Service> => {
    const data = await apiService.post<unknown>(BASE_URL, payload)
    return serviceSchema.parse(data)
  },

  /**
   * @function update - Updates an existing service
   * @param id - Id of the service to update
   * @param payload - Partial service data to update
   * @returns The updated Service object
   */
  update: async (id: number, payload: Partial<CreateServiceRequest>): Promise<Service> => {
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
    return serviceSchema.parse(data)
  },

  /**
   * @function remove - Deletes a service by id
   * @param id - Id of the service to delete
   * @returns
   */
  remove: async (id: number): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`)
  },
}
