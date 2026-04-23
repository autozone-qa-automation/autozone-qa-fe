/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { Service } from '../types/service.types'

export class ServiceVO {
  readonly id: number
  readonly name: string
  readonly description: string

  constructor(data: Service) {
    this.id = data.id
    this.name = data.name
    this.description = data.description ?? ''
  }

  getDisplayName(): string {
    return this.name
  }
}
