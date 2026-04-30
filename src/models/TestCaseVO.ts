/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { TestCase } from '@/types/testcase.types'

export class TestCaseVO {
  readonly id: number
  readonly title: string
  readonly relatedFeature: number
  readonly description: string
  readonly type: string
  readonly preconditions: string
  readonly postconditions: string
  readonly inputs: string
  readonly steps: string
  readonly code?: string | null
  readonly expectedOutput: string
  readonly active?: boolean | null
  readonly featureName?: string | null

  constructor(data: TestCase) {
    this.id = data.id
    this.title = data.title
    this.relatedFeature = data.relatedFeature
    this.description = data.description
    this.type = data.type
    this.preconditions = data.preconditions
    this.postconditions = data.postconditions
    this.inputs = data.inputs
    this.steps = data.steps
    this.code = data.code
    this.expectedOutput = data.expectedOutput
    this.active = data.active
    this.featureName = data.featureName
  }

  getDisplayName(): string {
    return this.title
  }
}
