/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import z from 'zod'
import type { ReleaseCreateVO } from '@/models/ReleaseCreateVO'
import type { Release, ReleaseStatus } from '@/types/Release.types'
import type { CreateReleasesRequest, FormValues } from '@/utils/schemas/release.schema'
import { releaseSchema } from '@/utils/schemas/release.schema'
import { apiService } from './api.service'

const BASE_URL = 'releases'

const releaseResponseSchema = releaseSchema
  .omit({
    releaseFeatureIds: true,
  })
  .extend({
    releaseId: z.number(),
    releaseLaunchDate: z.string().nullable(),
    releaseServiceId: z.number().nullable(),
    releaseServices: z.array(z.string()),
    releaseFeatures: z.array(z.any()),
  })

export const releaseService = {
  getAll: async (): Promise<Release[]> => {
    const data = await apiService.get<unknown>(BASE_URL)
    return releaseResponseSchema.array().parse(data) as Release[]
  },

  getById: async (id: string): Promise<FormValues> => {
    const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
    return releaseSchema.parse(data)
  },

  create: async (payload: ReleaseCreateVO): Promise<FormValues> => {
    const data = await apiService.post<unknown>(BASE_URL, payload)
    return releaseSchema.parse(data)
  },

  update: async (id: string, payload: Partial<CreateReleasesRequest>): Promise<FormValues> => {
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
    return releaseSchema.parse(data)
  },

  updateStatus: async (id: number, status: ReleaseStatus): Promise<Release> => {
    const encodedStatus = encodeURIComponent(status)
    const data = await apiService.put<unknown>(`${BASE_URL}/${id}/status/${encodedStatus}`, null)
    return releaseResponseSchema.parse(data) as Release
  },

  remove: async (id: string): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`)
  },
}
