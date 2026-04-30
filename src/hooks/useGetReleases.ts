/**
 * @file useGetReleases.ts
 * @description Hook para obtener datos del backend de Java de forma segura.
 */

import { useCallback, useEffect, useState } from 'react'
import { releaseService } from '@/services/releases.service'
import type { Release } from '@/types/Release.types'

export const useGetAllReleases = () => {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
        setError('Unexpected error!')
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
