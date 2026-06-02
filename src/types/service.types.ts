/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

export const serviceUrlSchema = z.object({
  idUrl: z.number(),
  nombre: z.string(),
  url: z.string(),
})

export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  urls: z.array(serviceUrlSchema),
})

export type ServiceUrl = z.infer<typeof serviceUrlSchema>
export type Service = z.infer<typeof serviceSchema>

export interface CreateServiceRequest {
  name: string
  description?: string
  urls: { nombre: string; url: string }[]
}