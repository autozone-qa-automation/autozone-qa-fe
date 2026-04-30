/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { FeatureVO } from '../models/FeatureVO'
import { featureService } from '../services/features.service'

/**
 * Represents the internal state of the useFeature hook.
 * @interface UseFeatureState
 * @property {FeatureVO} feature - The feature data object retrieved from the service.
 * @property {boolean} isLoading - Indicates if the fetch request is currently in progress.
 * @property {string | null} error - Error message if the fetch fails, otherwise null.
 */
interface UseFeatureState {
  feature: FeatureVO
  isLoading: boolean
  error: string | null
}

/**
 * The return payload of the useFeature hook.
 * Inherits all properties from UseFeatureState and adds a refetch mechanism.
 * @interface UseFeatureReturn
 * @extends UseFeatureState
 * @property {() => Promise<void>} refetch - Function to manually trigger a re-fetch of the feature data.
 */
interface UseFeatureReturn extends UseFeatureState {
  refetch: () => Promise<void>
}

/**
 * Custom React hook to fetch and manage the state of a specific Feature by its ID.
 * It automatically fetches the data on mount or when the ID changes.
 * * @param {string} id - The unique identifier of the feature to fetch.
 * @returns {UseFeatureReturn} An object containing the feature data, loading state, error state, and a refetch function.
 */
export const useFeature = (id: string): UseFeatureReturn => {
  const [state, setState] = useState<UseFeatureState>({
    feature: {} as FeatureVO,
    isLoading: false,
    error: null,
  })

  /**
   * Asynchronously fetches the feature data from the service.
   * Wrapped in `useCallback` to memoize the function, ensuring it only gets recreated
   * when the `id` parameter changes. This prevents infinite loops inside the `useEffect`.
   * * @async
   * @function fetchFeature
   */
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
  }, [id])

  useEffect(() => {
    fetchFeature()
  }, [fetchFeature])

  return { ...state, refetch: fetchFeature }
}
