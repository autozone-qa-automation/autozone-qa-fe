/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { FeatureVO } from '../models/FeatureVO'
import { featureService } from '../services/features.service'

interface UseFeaturesState {
  features: FeatureVO[]
  isLoading: boolean
  error: string | null
}

interface UseFeaturesReturn extends UseFeaturesState {
  refetch: () => Promise<void>
  fetchFeaturesFiltered: (id: string) => Promise<void>
}

export const useFeatures = (): UseFeaturesReturn => {
  const [state, setState] = useState<UseFeaturesState>({
    features: [],
    isLoading: false,
    error: null,
  })

  const fetchFeatures = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const raw = await featureService.getAll()
      setState({
        features: raw.map(f => new FeatureVO(f)),
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch features',
      }))
    }
  }, [])

  const fetchFeaturesFiltered = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const raw = await featureService.getAllFiltered(id)
      setState({
        features: raw.map(f => new FeatureVO(f)),
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch features',
      }))
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  return { ...state, refetch: fetchFeatures, fetchFeaturesFiltered }
}
