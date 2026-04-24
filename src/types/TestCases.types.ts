/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { z } from 'zod'

// 1. Define the base/create schema FIRST (without id, code, active)
export const createTestCaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .max(30, { message: 'Máximo 30 caracteres' }),
  relatedFeature: z
    .number({ message: 'El feature es obligatorio' })
    .min(1, { message: 'El feature es obligatorio' }),
  description: z.string().max(300, { message: 'Máximo 300 caracteres' }).optional().default(''),
  preconditions: z.string().max(300, { message: 'Máximo 300 caracteres' }).optional().default(''),
  inputs: z.string().max(300, { message: 'Máximo 300 caracteres' }).optional().default(''),
  steps: z
    .string()
    .min(1, { message: 'Los pasos son obligatorios' })
    .max(500, { message: 'Máximo 500 caracteres' }),
  postconditions: z.string().max(300, { message: 'Máximo 300 caracteres' }).optional().default(''),
  expectedOutput: z
    .string()
    .min(1, { message: 'La salida esperada es obligatoria' })
    .max(300, { message: 'Máximo 300 caracteres' }),
  type: z.enum(['REGRESSION', 'ON_DEMAND']),
})

export type CreateTestCaseRequest = z.infer<typeof createTestCaseSchema>

// 2. Extend the base schema to add the system-generated fields
export const testCaseSchema = createTestCaseSchema.extend({
  id: z.number(),
  code: z.string().optional(),
  active: z.boolean().optional(),
})

export type TestCase = z.infer<typeof testCaseSchema>
