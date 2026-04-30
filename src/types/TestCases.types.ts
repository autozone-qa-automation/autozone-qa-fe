/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { z } from 'zod'

export const createTestCaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Maximum 30 characters' }),
  relatedFeature: z
    .number({ message: 'Feature is required' })
    .min(1, { message: 'Feature is required' }),
  description: z.string().max(300, { message: 'Maximum 300 characters' }).optional().default(''),
  preconditions: z.string().max(300, { message: 'Maximum 300 characters' }).optional().default(''),
  inputs: z.string().max(300, { message: 'Maximum 300 characters' }).optional().default(''),
  steps: z
    .string()
    .min(1, { message: 'Steps are required' })
    .max(500, { message: 'Maximum 500 characters' }),
  postconditions: z.string().max(300, { message: 'Maximum 300 characters' }).optional().default(''),
  expectedOutput: z
    .string()
    .min(1, { message: 'Expected output is required' })
    .max(300, { message: 'Maximum 300 characters' }),
  type: z.enum(['REGRESSION', 'ON_DEMAND']),
})

export type CreateTestCaseRequest = z.infer<typeof createTestCaseSchema>

export const testCaseSchema = createTestCaseSchema.extend({
  id: z.number(),
  code: z.string().optional(),
  active: z.boolean().optional(),
})

export type TestCase = z.infer<typeof testCaseSchema>
