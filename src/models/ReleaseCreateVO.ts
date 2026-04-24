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
  readonly releaseService: number[]
  readonly releaseFeatures: number[]
  readonly releaseTags: string[]

  constructor(data: FormValues) {
    this.releaseName = data.releaseName
    this.releaseDescription = data.releaseDescription
    this.releaseVersion = data.releaseVersion
    this.releaseStatus = data.releaseStatus
    this.releaseService = data.releaseService
    this.releaseFeatures = data.releaseFeatures
    this.releaseTags = data.releaseTags
  }

  getDisplayName(): string {
    return this.releaseName
  }
}
