import { useCallback, useEffect, useState } from 'react'
import { FeatureVO } from '../models/FeatureVO'
import { ServiceVO } from '../models/ServiceVO'
import { featureService } from '../services/features.service'
import { servicesService } from '../services/services.service'

interface UseGetServiceByIdState {
  service: ServiceVO | null
  features: FeatureVO[]
  loading: boolean
  error: string | null
}

export const useGetServiceById = (id: number) => {
  const [state, setState] = useState<UseGetServiceByIdState>({
    service: null,
    features: [],
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (!id) return
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const [serviceData, allFeatures] = await Promise.all([
        servicesService.getById(id),
        featureService.getAll(),
      ])

      const serviceVO = new ServiceVO(serviceData)

      const filteredFeatures = allFeatures
        .filter(f => Number(f.idService) === id)
        .map(f => new FeatureVO(f))

      setState({
        service: serviceVO,
        features: filteredFeatures,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error al cargar el servicio',
      }))
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}
