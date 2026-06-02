/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useState } from 'react'
import { servicesService } from '@/services/services.service'
import type { CreateServiceRequest, Service } from '@/types/service.types'

/**
 * Interface describing the
 * return shape of the useCreateService hook
 */
interface IUseCreateServiceResponse {
  createService: (data: CreateServiceRequest) => Promise<Service | null>
  loading: boolean
  error: string | null
  success: boolean
}

/**
 * @function useCreateService - Hook for creating a new service.
 * Manages loading, error and success state.
 * Re-throws errors so the caller can handle notifications directly.
 * @returns createService function and loading/error/success state
 */
export const useCreateService = (): IUseCreateServiceResponse => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  /**
   * @function createService - Executes the POST request to create a service
   * @param data - Service payload to send
   * @returns The created Service, or null if the request failed
   */
  const createService = useCallback(async (data: CreateServiceRequest): Promise<Service | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const newService = await servicesService.create(data)
      setSuccess(true)
      return newService
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error creating service.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createService, loading, error, success }
}
