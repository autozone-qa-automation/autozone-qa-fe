/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { featureService } from '@/services/features.service'

/**
 * Interfaz para la respuesta del hook de desactivación
 */
interface IUseDeactivateFeatureResponse {
  deactivateFeature: (id: string) => Promise<boolean>
  loading: boolean
  error: string | null
  success: boolean
}

/**
 * Hook personalizado para manejar la desactivación lógica de un Feature
 * Gestiona el estado de la petición y redirecciona al finalizar con éxito
 */
export const useDeactivateFeature = (): IUseDeactivateFeatureResponse => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const navigate = useNavigate()

  /**
   * Función para ejecutar la petición PUT de desactivación
   */
  const deactivateFeature = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        // H: Llama a nuestro servicio recién modificado alineado al backend
        await featureService.deactivate(id)

        setSuccess(true)

        //H: Redirección automática a la pantalla general de Features
        navigate('/features')

        return true
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error inesperado al desactivar el feature.')
        }
        return false
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  return { deactivateFeature, loading, error, success }
}
