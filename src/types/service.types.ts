/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
})

export type Service = z.infer<typeof serviceSchema>

export const createServiceSchema = serviceSchema.omit({ id: true })
export type CreateServiceRequest = z.infer<typeof createServiceSchema>
