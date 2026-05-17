import { useState } from 'react'
import { featureService } from '@/services/features.service'
import type { CreateFeatureRequest, Feature } from '@/types/feature.types'

export function useUpdateFeature() {
  const [loading, setLoading] = useState(false)

  const updateFeature = async (
    id: string,
    payload: Partial<CreateFeatureRequest>
  ): Promise<Feature> => {
    try {
      setLoading(true)

      return await featureService.update(id, payload)
    } finally {
      setLoading(false)
    }
  }

  return {
    updateFeature,
    loading,
  }
}
