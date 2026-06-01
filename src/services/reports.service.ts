/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { z } from 'zod'
import { ReportVO } from '@/models/ReportVO'
import type { Report } from '@/types/Report.types'
import { apiService } from './api.service'

const BASE_URL = '/reports'

const reportFeatureSchema = z.object({
  featureName: z.string(),
  testCases: z.array(z.string()),
})

const reportServiceSchema = z.object({
  serviceName: z.string(),
  features: z.array(reportFeatureSchema),
})

const reportSchema = z.object({
  releaseId: z.number(),
  releaseName: z.string(),
  releaseDescription: z.string(),
  releaseVersion: z.string(),
  releaseStatus: z.string(),
  releaseTags: z.array(z.string()),
  releaseCreationDate: z.string(),
  releaseLaunchDate: z.string().nullable(),
  services: z.array(reportServiceSchema),
})

export interface ReportsQueryParams {
  from?: string
  to?: string
  service?: string
  tag?: string
  status?: string
}

export const reportsService = {
  getAll: async (params?: ReportsQueryParams): Promise<Report[]> => {
    const data = await apiService.get<unknown>(BASE_URL, { params })
    return reportSchema.array().parse(data) as Report[]
  },

  getAllVO: async (params?: ReportsQueryParams): Promise<ReportVO[]> => {
    const reports = await reportsService.getAll(params)
    return reports.map(report => new ReportVO(report))
  },
}
