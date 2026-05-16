/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useState } from 'react'
import { releaseService } from '@/services/releases.service'
import type { ReleaseStatus } from '@/types/Release.types'

export function useUpdateReleaseStatus() {
  const [loading, setLoading] = useState<boolean>(false)

  const updateReleaseStatus = async (releaseId: number, status: ReleaseStatus) => {
    try {
      setLoading(true)
      return await releaseService.updateStatus(releaseId, status)
    } finally {
      setLoading(false)
    }
  }

  return {
    updateReleaseStatus,
    loading,
  }
}