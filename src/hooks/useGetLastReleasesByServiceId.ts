/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { ReleaseVO } from '@/models/ReleaseVO'
import { releaseService } from '@/services/releases.service'

interface UseGetReleasesByServiceIdState {
  releases: ReleaseVO[]
  loading: boolean
  error: string | null
}

export const useGetLastReleasesByServiceId = (serviceId: number) => {
  const [state, setState] = useState<UseGetReleasesByServiceIdState>({
    releases: [],
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (!serviceId) return
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await releaseService.getLastByServiceId(serviceId)
      const mapped = data.map(r => new ReleaseVO(r))

      setState({
        releases: mapped,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error al cargar releases',
      }))
    }
  }, [serviceId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}
