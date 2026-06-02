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
  serviceId?: number
  startDate?: string
  endDate?: string
  tagName?: string
}

export interface ExportReportsQueryParams {
  releaseIds: string
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

  exportCsv: async (params: ExportReportsQueryParams): Promise<Blob> => {
    return apiService.get<Blob>(`${BASE_URL}/export`, {
      params,
      responseType: 'blob',
    })
  },
}
