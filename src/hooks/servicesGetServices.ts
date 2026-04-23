/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { useEffect, useState } from 'react'
import { getServices } from '@/services/servicesService'
import type { Service } from '@/types/Service.types'

export const useGetServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getServices()
      .then((data: Service[]) => {
        setServices(data)
      })
      .catch((err: unknown) => {
        // Tipamos como 'unknown' y validamos si es una instancia de Error
        // para acceder a .message de forma segura
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { services, loading, error }
}
