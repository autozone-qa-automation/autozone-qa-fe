import type { Feature } from '../types/feature.types'

export class FeatureVO {
  readonly id: number
  readonly featureName: string
  readonly featureDescription: string
  readonly idService: number

  constructor(data: Feature) {
    this.id = data.id
    this.featureName = data.featureName
    this.featureDescription = data.featureDescription
    this.idService = data.idService
  }

  getDisplayName(): string {
    return this.featureName
  }
}
