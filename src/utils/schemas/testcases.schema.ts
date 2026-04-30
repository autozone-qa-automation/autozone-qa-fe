/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const testCaseFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Minimum 3 characters required' })
    .max(100, { message: 'Maximum 100 characters allowed' }),

  relatedFeature: z
    .number({
      message: 'You must select a valid feature',
    })
    .positive({ message: 'Select at least one feature' }),

  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(500, { message: 'Maximum 500 characters allowed' }),

  type: z.string().min(1, { message: 'Please select a test type' }),

  preconditions: z.string().min(1, { message: 'Preconditions are required' }),

  postconditions: z.string().min(1, { message: 'Postconditions are required' }),

  inputs: z.string().min(1, { message: 'Inputs are required' }),

  steps: z.string().min(1, { message: 'Steps are required' }),

  code: z.string().max(2000, { message: 'Code snippet is too long' }).nullable().optional(),

  expectedOutput: z.string().min(1, { message: 'Expected output is required' }),
})

export type TestCaseFormValues = z.infer<typeof testCaseFormSchema>
