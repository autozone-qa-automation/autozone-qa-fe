/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - 2026
 */

export type ReportReleaseStatus = 'Draft' | 'Active' | 'Progress' | 'Closed'

export interface ReportFeature {
  featureName: string
  testCases: string[]
}

export interface ReportService {
  serviceName: string
  features: ReportFeature[]
}

export interface Report {
  releaseId: number
  releaseName: string
  releaseDescription: string
  releaseVersion: string
  releaseStatus: ReportReleaseStatus
  releaseTags: string[]
  releaseCreationDate: string
  releaseLaunchDate: string | null
  services: ReportService[]
}
