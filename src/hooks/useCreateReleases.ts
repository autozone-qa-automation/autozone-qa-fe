/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useState } from 'react'
import type { ReleaseCreateVO } from '../models/ReleaseCreateVO'
import { releaseService } from '../services/releases.service'

interface UseCreateReleaseState {
  isLoading: boolean
  error: string | null
}

interface UseCreateReleaseReturn extends UseCreateReleaseState {
  postRelease: (releaseCreateVO: ReleaseCreateVO) => Promise<void>
}

export const useCreateReleases = (): UseCreateReleaseReturn => {
  const [state, setState] = useState<UseCreateReleaseState>({
    isLoading: false,
    error: null,
  })
  const postRelease = useCallback(async (releaseCreateVO: ReleaseCreateVO) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    await releaseService.create(releaseCreateVO)
    setState({
      isLoading: false,
      error: null,
    })
  }, [])

  return { ...state, postRelease }
}
