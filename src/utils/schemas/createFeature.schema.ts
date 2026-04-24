/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const featureSchema = z.object({
  featureName: z
    .string()
    .min(3, { message: 'Minimum 3 characters required' })
    .max(50, { message: 'Maximum 50 characters allowed' }),
  description: z
    .string()
    .min(3, { message: 'Minimum 3 characters required' })
    .max(200, { message: 'Maximum 200 characters allowed' }),
  idServices: z.string().min(1, 'Select a service'),
})

export type FormValues = z.infer<typeof featureSchema>
