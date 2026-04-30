/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useState } from 'react'
import { featureService } from '@/services/features.service'
import type { CreateFeatureRequest, Feature } from '../types/feature.types'

/**
 * Interfaz para la respuesta del hook de creación
 */
interface IUseCreateFeatureResponse {
  createFeature: (data: CreateFeatureRequest) => Promise<Feature | null>
  loading: boolean
  error: string | null
  success: boolean
}

/**
 * Hook para manejar la creación de un nuevo Feature.
 */
export const useCreateFeature = (): IUseCreateFeatureResponse => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  /**
   * Función para ejecutar la petición POST
   */
  const createFeature = useCallback(async (data: CreateFeatureRequest): Promise<Feature | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const newFeature = await featureService.create(data)
      setSuccess(true)
      return newFeature
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error inesperado al crear el feature.')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { createFeature, loading, error, success }
}
