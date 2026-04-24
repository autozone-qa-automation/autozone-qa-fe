/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

export type ReleaseStatus = 'Draft' | 'Active' | 'Progress'

export interface Release {
  releaseId: number
  releaseName: string
  releaseDescription: string
  releaseCreationDate: string
  releaseLaunchDate: string
  releaseVersion: string
  releaseTags: string
  releaseStatus: ReleaseStatus
  releaseService: string
}
