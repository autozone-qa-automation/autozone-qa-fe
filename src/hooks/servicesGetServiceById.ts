/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { useEffect, useState } from 'react'
import { getServiceById } from '@/services/servicesService'

// 1. Definimos una interfaz para evitar el 'any'
export interface ServiceData {
  id: number
  name: string
  description?: string
  repositoryUrl?: string
  documentationUrl?: string
}

export const useGetServiceById = (id: number) => {
  // 2. Tipamos el estado correctamente
  const [service, setService] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    getServiceById(id)
      .then((data: ServiceData) => {
        setService(data)
      })
      .catch((err: Error) => {
        // 3. Manejamos el error de forma segura para evitar el error de member access
        setError(err.message || 'Error desconocido')
      })
      .finally(() => setLoading(false))
  }, [id])

  return { service, loading, error }
}
