/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetServices } from '@/hooks/useGetServices'
import type { ReportVO } from '@/models/ReportVO'
import type { ReportsQueryParams } from '@/services/reports.service'
import { reportsService } from '@/services/reports.service'

interface UseReportsReturn {
  startDate: string | null
  endDate: string | null
  selectedService: string
  selectedTags: string[]
  selectedReportIds: number[]
  reports: ReportVO[]
  serviceOptions: string[]
  serviceMap: Map<string, number>
  tagOptions: string[]
  loading: boolean
  error: string | null
  allReportsSelected: boolean
  someReportsSelected: boolean
  recordsSummary: string
  setStartDate: (value: string | null) => void
  setEndDate: (value: string | null) => void
  handleServiceChange: (values: string[]) => void
  handleTagsChange: (values: string[]) => void
  handleToggleAllReports: (checked: boolean) => void
  handleToggleSingleReport: (reportId: number, checked: boolean) => void
  handleGenerateReport: () => Promise<void>
  handleExportCsv: () => Promise<void>
}

export const useReports = (): UseReportsReturn => {
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const [selectedService, setSelectedService] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([])

  const [reports, setReports] = useState<ReportVO[]>([])
  const [allTagOptions, setAllTagOptions] = useState<string[]>([])
  const [totalReportsCount, setTotalReportsCount] = useState(0)
  const [isShowingFilteredResults, setIsShowingFilteredResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { services } = useGetServices()

  const serviceOptions = useMemo(() => services.map(service => service.name), [services])
  const serviceMap = useMemo(
    () => new Map(services.map(service => [service.name, service.id])),
    [services]
  )
  const tagOptions = allTagOptions
  const selectedTagFilter = selectedTags.length ? selectedTags.join(',') : undefined

  const normalizeTags = (values: string[]): string[] =>
    Array.from(new Set(values.map(tag => tag.trim()).filter(Boolean)))

  const getTagOptionsFromReports = useCallback(
    (data: ReportVO[]): string[] => [...new Set(data.flatMap(report => report.releaseTags))].sort(),
    []
  )

  const formatDateForApi = useCallback((value: string | null): string | undefined => {
    if (!value) return undefined
    const formatted = dayjs(value)
    return formatted.isValid() ? formatted.format('YYYY-MM-DD') : value
  }, [])

  const loadReports = useCallback(
    async (filters?: ReportsQueryParams) => {
      setLoading(true)
      setError(null)

      try {
        const data = await reportsService.getAllVO(filters)
        const hasFilters = Boolean(
          filters?.serviceId || filters?.startDate || filters?.endDate || filters?.tagName
        )

        setReports(data)
        setIsShowingFilteredResults(hasFilters)
        if (!hasFilters) {
          setAllTagOptions(getTagOptionsFromReports(data))
          setTotalReportsCount(data.length)
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    },
    [getTagOptionsFromReports]
  )

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  useEffect(() => {
    setSelectedReportIds(prev => prev.filter(id => reports.some(report => report.releaseId === id)))
  }, [reports])

  const visibleReportIds = useMemo(() => reports.map(report => report.releaseId), [reports])
  const allReportsSelected =
    visibleReportIds.length > 0 && visibleReportIds.every(id => selectedReportIds.includes(id))
  const someReportsSelected = selectedReportIds.length > 0 && !allReportsSelected

  const handleServiceChange = (values: string[]) => {
    const value = values[0] ?? ''
    setSelectedService(value)
    setSelectedServiceId(serviceMap.get(value))
  }

  const handleTagsChange = (values: string[]) => {
    setSelectedTags(normalizeTags(values))
  }

  const handleToggleAllReports = (checked: boolean) => {
    setSelectedReportIds(checked ? visibleReportIds : [])
  }

  const handleToggleSingleReport = (reportId: number, checked: boolean) => {
    setSelectedReportIds(prev => {
      if (checked) {
        return prev.includes(reportId) ? prev : [...prev, reportId]
      }
      return prev.filter(id => id !== reportId)
    })
  }

  const handleGenerateReport = async () => {
    await loadReports({
      serviceId: selectedServiceId,
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
      tagName: selectedTagFilter,
    })
  }

  const handleExportCsv = async () => {
    if (!selectedReportIds.length) {
      setError('Select at least one release to export')
      return
    }

    setError(null)

    try {
      const blob = await reportsService.exportCsv({
        releaseIds: selectedReportIds.join(','),
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = 'reportes_releases.csv'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to export CSV')
    }
  }

  const shownReportsCount = reports.length
  const totalReleasesCount = totalReportsCount || shownReportsCount
  const recordsSummary = isShowingFilteredResults
    ? `Showing ${shownReportsCount} of ${totalReleasesCount} releases`
    : `Showing ${shownReportsCount} of ${shownReportsCount} releases`

  return {
    startDate,
    endDate,
    selectedService,
    selectedTags,
    selectedReportIds,
    reports,
    serviceOptions,
    serviceMap,
    tagOptions,
    loading,
    error,
    allReportsSelected,
    someReportsSelected,
    recordsSummary,
    setStartDate,
    setEndDate,
    handleServiceChange,
    handleTagsChange,
    handleToggleAllReports,
    handleToggleSingleReport,
    handleGenerateReport,
    handleExportCsv,
  }
}
