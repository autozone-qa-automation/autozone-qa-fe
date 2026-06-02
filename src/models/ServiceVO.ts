/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { Service, ServiceUrl } from '../types/service.types'

export class ServiceVO {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly urls: ServiceUrl[]

  constructor(data: Service) {
    this.id = data.id
    this.name = data.name
    this.description = data.description ?? ''
    this.urls = data.urls ?? []
  }

  getDisplayName(): string {
    return this.name
  }
}
