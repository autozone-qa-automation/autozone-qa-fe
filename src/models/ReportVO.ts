/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { Report, ReportFeature, ReportService } from '@/types/Report.types'

export class ReportFeatureVO {
  readonly featureName: string
  readonly testCases: string[]

  constructor(data: ReportFeature) {
    this.featureName = data.featureName
    this.testCases = data.testCases ?? []
  }
}

export class ReportServiceVO {
  readonly serviceName: string
  readonly features: ReportFeatureVO[]

  constructor(data: ReportService) {
    this.serviceName = data.serviceName
    this.features = (data.features ?? []).map((feature) => new ReportFeatureVO(feature))
  }
}

export class ReportVO {
  readonly releaseId: number
  readonly releaseName: string
  readonly releaseDescription: string
  readonly releaseVersion: string
  readonly releaseStatus: string
  readonly releaseTags: string[]
  readonly releaseCreationDate: string
  readonly releaseLaunchDate: string | null
  readonly services: ReportServiceVO[]

  constructor(data: Report) {
    this.releaseId = data.releaseId
    this.releaseName = data.releaseName
    this.releaseDescription = data.releaseDescription
    this.releaseVersion = data.releaseVersion
    this.releaseStatus = data.releaseStatus
    this.releaseTags = data.releaseTags ?? []
    this.releaseCreationDate = data.releaseCreationDate
    this.releaseLaunchDate = data.releaseLaunchDate
    this.services = (data.services ?? []).map((service) => new ReportServiceVO(service))
  }

  getDisplayName(): string {
    return this.releaseName
  }
}
