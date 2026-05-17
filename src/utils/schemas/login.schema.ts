/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const loginschema = z.object({
  email: z
    .email({ message: 'Invalid email address' })
    .min(3, { message: 'Minimum 3 characters required' })
    .max(50, { message: 'Maximum 50 characters allowed' }),
  password: z
    .string()
    .min(1, { message: 'Minimum 1 characters required' })
    .max(100, { message: 'Maximum 100 characters allowed' }),
})

export type FormValues = z.infer<typeof loginschema>
