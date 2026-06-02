/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { Release } from '@/types/Release.types'

export class ReleaseVO {
  readonly releaseId: number
  readonly releaseName: string
  readonly releaseDescription: string
  readonly releaseCreationDate: string
  readonly releaseLaunchDate: string | null
  readonly releaseVersion: string
  readonly releaseTags: string[]
  readonly releaseStatus: string
  readonly releaseServiceId: number

  constructor(data: Release) {
    this.releaseId = data.releaseId
    this.releaseName = data.releaseName
    this.releaseDescription = data.releaseDescription
    this.releaseCreationDate = data.releaseCreationDate
    this.releaseLaunchDate = data.releaseLaunchDate
    this.releaseVersion = data.releaseVersion
    this.releaseTags = data.releaseTags
    this.releaseStatus = data.releaseStatus
    this.releaseServiceId = data.releaseServiceId
  }

  getDisplayName(): string {
    return this.releaseName
  }
}
