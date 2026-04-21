import { z } from 'zod'

export const featureSchema = z.object({
  id: z.number(),
  featureName: z.string(),
  featureDescription: z.string(),
  idService: z.number(),
})

export type Feature = z.infer<typeof featureSchema>

export const createFeatureSchema = featureSchema.omit({ id: true })
export type CreateFeatureRequest = z.infer<typeof createFeatureSchema>
