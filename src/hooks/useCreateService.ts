/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useState } from 'react'
import { servicesService } from '@/services/services.service'
import type { CreateServiceRequest, Service } from '@/types/service.types'

interface IUseCreateServiceResponse {
  createService: (data: CreateServiceRequest) => Promise<Service | null>
  loading: boolean
  error: string | null
  success: boolean
}

export const useCreateService = (): IUseCreateServiceResponse => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const createService = useCallback(async (data: CreateServiceRequest): Promise<Service | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const newService = await servicesService.create(data)
      setSuccess(true)
      return newService
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unexpected error creating service.')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { createService, loading, error, success }
}
