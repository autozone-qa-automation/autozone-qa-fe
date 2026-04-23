/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { ServiceVO } from '../models/ServiceVO'
import { servicesService } from '../services/services.service'

interface UseGetServicesState {
  services: ServiceVO[]
  loading: boolean
  error: string | null
}

interface UseGetServicesReturn extends UseGetServicesState {
  refetch: () => Promise<void>
}

export const useGetServices = (): UseGetServicesReturn => {
  const [state, setState] = useState<UseGetServicesState>({
    services: [],
    loading: false,
    error: null,
  })

  const fetchServices = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const raw = await servicesService.getAll()
      setState({
        services: raw.map(s => new ServiceVO(s)),
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch services',
      }))
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { ...state, refetch: fetchServices }
}
