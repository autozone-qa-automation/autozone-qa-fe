/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import axiosInstance from '@/lib/axios'
import type { Service } from '@/types/Service.types'

export const getServices = async (): Promise<Service[]> => {
  const { data } = await axiosInstance.get<Service[]>('/v1/services')
  return data
}

export const getServiceById = async (id: number): Promise<Service> => {
  const { data } = await axiosInstance.get<Service>(`/v1/services/${id}`)
  return data
}
