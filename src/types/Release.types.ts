/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

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
  releaseLaunchDate: string
  releaseVersion: string
  releaseTags: string
  releaseStatus: ReleaseStatus
  releaseServices: string[] // Corresponde a List<String> releaseServices
  releaseServiceIds: number[] // Corresponde a List<Long> releaseServiceIds
}
