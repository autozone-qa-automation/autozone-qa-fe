/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { FormValues } from '@/utils/schemas/release.schema'

export class ReleaseCreateVO {
  readonly releaseName: string
  readonly releaseDescription: string | undefined
  readonly releaseVersion: string
  readonly releaseStatus: string
  readonly releaseServiceId: number | null
  readonly releaseFeatureIds: number[]
  readonly releaseTags: string[]
  readonly releaseCreationDate: string | undefined

  constructor(data: FormValues) {
    this.releaseName = data.releaseName
    this.releaseDescription = data.releaseDescription
    this.releaseVersion = data.releaseVersion
    this.releaseStatus = data.releaseStatus
    this.releaseServiceId = data.releaseServiceId
    this.releaseFeatureIds = data.releaseFeatureIds
    this.releaseTags = data.releaseTags
    this.releaseCreationDate = data.releaseCreationDate
  }

  getDisplayName(): string {
    return this.releaseName
  }
}
