/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const testCaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  relatedFeature: z.number(),
  description: z.string(),
  type: z.string(),
  preconditions: z.string(),
  postconditions: z.string(),
  inputs: z.string(),
  steps: z.string(),
  code: z.string().nullable().optional(),
  expectedOutput: z.string(),
  active: z.boolean().nullable().optional(),
  featureName: z.string().nullable().optional(),
})

export type TestCase = z.infer<typeof testCaseSchema>

export const testCasesSchema = z.array(testCaseSchema)

export const createTestCaseSchema = testCaseSchema.omit({
  id: true,
  active: true,
  featureName: true,
})
export type CreateTestCaseRequest = z.infer<typeof createTestCaseSchema>
