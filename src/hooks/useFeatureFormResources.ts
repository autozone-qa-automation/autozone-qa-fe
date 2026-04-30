/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { servicesService } from '../services/services.service'

interface SelectOption {
  value: string
  label: string
}

interface UseFeatureFormResourcesReturn {
  servicesOptions: SelectOption[]
  loading: boolean
  error: string | null
}

export const useFeatureFormResources = (): UseFeatureFormResourcesReturn => {
  const [servicesOptions, setServicesOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAndFormatServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await servicesService.getAll()
      const formatted = data.map(s => ({
        value: s.id.toString(),
        label: s.name || 'Unknown Service',
      }))

      setServicesOptions(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAndFormatServices()
  }, [fetchAndFormatServices])

  return { servicesOptions, loading, error }
}
