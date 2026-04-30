/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

import type { FeatureVO } from '../models/FeatureVO'

export type ReleaseStatus = 'Draft' | 'Active' | 'Progress'

/**
 * Interface que refleja exactamente el ReleaseVO del backend.
 * Nota: releaseServices y releaseServiceIds son listas (arrays).
 */
export interface Release {
  releaseId: number
  releaseName: string
  releaseDescription: string
  releaseCreationDate: string
  releaseLaunchDate: string | null
  releaseVersion: string
  releaseTags: string[]
  releaseStatus: ReleaseStatus
  releaseServices: string[]
  releaseServiceId: number
  releaseFeatures: FeatureVO[]
}
