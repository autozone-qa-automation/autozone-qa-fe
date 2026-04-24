/**
 * @file useGetReleases.ts
 * @description Hook personalizado para manejar la carga de datos de releases.
 * Implementa manejo de estados de carga, error y sincronización con el servicio.
 */

import { useCallback, useEffect, useState } from 'react'
import { releaseService } from '@/services/releases.service'
import type { Release } from '@/types/Release.types'

/**
 * Hook para obtener y gestionar la lista de releases.
 * * @returns {Object} Objeto con los siguientes estados:
 * - releases: Lista de releases cargados.
 * - loading: Estado de carga de la petición.
 * - error: Mensaje de error formateado o null.
 * - refetch: Función para reintentar la carga.
 */
export const useGetAllReleases = () => {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Ejecuta la petición al servicio para obtener los releases.
   * Maneja errores de red y de API de forma segura.
   */
  const fetchReleases = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await releaseService.getAll()
      setReleases(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchReleases()
  }, [fetchReleases])

  return { releases, loading, error, refetch: fetchReleases }
}
