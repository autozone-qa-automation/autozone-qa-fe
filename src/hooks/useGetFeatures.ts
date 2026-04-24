/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { ServiceError } from '@/models/errors/ServiceError'
import { FeatureVO } from '../models/FeatureVO'
import { featureService } from '../services/features.service'

/**
 * Represents the internal state for the multiple-feature fetch hook.
 * @interface UseFeaturesState
 * @property {FeatureVO[]} features - An array of feature objects retrieved from the service.
 * @property {boolean} isLoading - Indicates if a fetch request (all or filtered) is in progress.
 * @property {string | null} error - User-friendly error message if the fetch fails.
 */
interface UseFeaturesState {
  features: FeatureVO[]
  isLoading: boolean
  error: string | null
}

/**
 * The return payload of the useFeatures hook.
 * @interface UseFeaturesReturn
 * @extends UseFeaturesState
 * @property {() => Promise<void>} refetch - Manually re-fetches all features.
 * @property {(id: string) => Promise<void>} fetchFeaturesFiltered - Fetches a specific subset of features based on an ID.
 */
interface UseFeaturesReturn extends UseFeaturesState {
  refetch: () => Promise<void>
  fetchFeaturesFiltered: (id: string) => Promise<void>
}

/**
 * Custom React hook to manage fetching a list of Features.
 * It provides methods to fetch all features on mount, re-fetch them, or fetch a filtered list.
 * @returns {UseFeaturesReturn} The state containing the features array, loading status, error message, and trigger functions.
 */
export const useFeatures = (): UseFeaturesReturn => {
  const [state, setState] = useState<UseFeaturesState>({
    features: [],
    isLoading: false,
    error: null,
  })

  /**
   * Asynchronously fetches all features from the service.
   * Maps the raw server data into strongly-typed `FeatureVO` class instances.
   * Also parses custom `ServiceError` instances into localized, user-friendly Spanish messages.
   * @async
   * @function fetchFeatures
   */
  const fetchFeatures = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const raw = await featureService.getAll()
      setState({
        // Transforms raw API data into Value Objects
        features: raw.map(f => new FeatureVO(f)),
        isLoading: false,
        error: null,
      })
    } catch (err: unknown) {
      let errorMessage: string = 'Failed to fetch features'

      // Detailed error evaluation for UI feedback
      if (err instanceof ServiceError) {
        if (err.type === 'VALIDATION_ERROR') {
          errorMessage = 'Los datos recibidos del servidor tienen un formato incorrecto.'
        } else if (err.type === 'API_ERROR') {
          errorMessage =
            err.status === 404 ? 'No se encontraron features.' : `Error de conexión: ${err.message}`
        } else {
          errorMessage = err.message
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [])

  /**
   * Asynchronously fetches a filtered list of features based on a specific ID.
   * Implements the same Data Mapping and Error Handling logic as `fetchFeatures`.
   * @async
   * @function fetchFeaturesFiltered
   * @param {string} id - The identifier used to filter the features.
   */
  const fetchFeaturesFiltered = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const raw = await featureService.getAllFiltered(id)
      setState({
        features: raw.map(f => new FeatureVO(f)),
        isLoading: false,
        error: null,
      })
    } catch (err: unknown) {
      let errorMessage: string = 'Failed to fetch features'

      if (err instanceof ServiceError) {
        if (err.type === 'VALIDATION_ERROR') {
          errorMessage = 'Los datos recibidos del servidor tienen un formato incorrecto.'
        } else if (err.type === 'API_ERROR') {
          errorMessage =
            err.status === 404 ? 'No se encontraron features.' : `Error de conexión: ${err.message}`
        } else {
          errorMessage = err.message
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  return { ...state, refetch: fetchFeatures, fetchFeaturesFiltered }
}
