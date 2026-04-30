/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'
//Este schema es para la validacion del formulario de Create Release
export const releaseSchema = z.object({
  releaseName: z
    .string()
    .min(3, { message: 'Minimum 3 characters required' })
    .max(50, { message: 'Maximum 50 characters allowed' }),
  releaseDescription: z.string().max(200, { message: 'Maximum 200 characters allowed' }).optional(),
  releaseVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, { message: 'Required format: X.X.X (e.g., 1.0.0)' }),
  releaseStatus: z.enum(['Draft', 'Progress', 'Active']),
  releaseCreationDate: z.string().optional(),
  releaseServiceId: z.number().min(1, 'Required').nullable(),
  releaseFeatureIds: z.array(z.number()).min(1, 'Select at least one'),
  releaseTags: z.array(z.string()).min(1, 'Add at least one tag'),
})

export type FormValues = z.infer<typeof releaseSchema>

export const createReleasesSchema = releaseSchema.omit({})
export type CreateReleasesRequest = z.infer<typeof createReleasesSchema>
