/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'

/**
 * Zod schema for a single URL entry as returned by the API.
 * Includes idUrl, which is assigned by the backend.
 */
export const serviceUrlSchema = z.object({
  idUrl: z.number(),
  nombre: z.string(),
  url: z.string(),
})

/**
 * Zod schema for a full Service as returned by the API.
 */
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  urls: z.array(serviceUrlSchema),
})

export type ServiceUrl = z.infer<typeof serviceUrlSchema>
export type Service = z.infer<typeof serviceSchema>

/**
 * URL payload schema for creation — omits idUrl, which is assigned by the backend.
 */
export const createServiceUrlSchema = serviceUrlSchema.omit({ idUrl: true })

/**
 * Payload schema for POST /services — omits all server-generated fields.
 */
export const createServiceSchema = serviceSchema.omit({ id: true }).extend({
  urls: z.array(createServiceUrlSchema),
})

/**
 * Type-safe request payload for creating a new service, derived from the Zod schema.
 */
export type CreateServiceRequest = z.infer<typeof createServiceSchema>
