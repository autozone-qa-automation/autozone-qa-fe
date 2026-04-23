/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { FeatureVO } from '../models/FeatureVO'
import { featureService } from '../services/features.service'

interface UseFeatureState {
  feature: FeatureVO
  isLoading: boolean
  error: string | null
}

interface UseFeatureReturn extends UseFeatureState {
  refetch: () => Promise<void>
}

export const useFeature = (id: string): UseFeatureReturn => {
  const [state, setState] = useState<UseFeatureState>({
    feature: {} as FeatureVO,
    isLoading: false,
    error: null,
  })

  const fetchFeature = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const raw = await featureService.getById(id)
      setState({
        feature: new FeatureVO(raw),
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch feature',
      }))
    }
  }, [])

  useEffect(() => {
    fetchFeature()
  }, [fetchFeature])

  return { ...state, refetch: fetchFeature }
}
