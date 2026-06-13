/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { releaseService } from '@/services/releases.service'

export function useDeleteRelease() {
  const [loading, setLoading] = useState<boolean>(false)

  const deleteReleaseStatus = async (releaseId: number) => {
    try {
      setLoading(true)
      await releaseService.delete(releaseId)

      notifications.show({
        title: 'Release deleted',
        message: 'Release has been deleted successfully.',
        'data-testid': 'release-delete-success-notification',
      })
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Unexpected error',
        color: 'red',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteReleaseStatus, loading }
}
