/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
  Badge,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Stack,
  Table,
  Text,
  Title,
  TagsInput,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconCalendar, IconDownload } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGetServices } from '@/hooks/useGetServices'
import { reportsService } from '@/services/reports.service'
import type { ReportsQueryParams } from '@/services/reports.service'
import type { ReportVO } from '@/models/ReportVO'
import './Reports.css'

export function Reports() {
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
  
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const serviceOptions = services.map(service => service.name)
  
  const serviceMap = new Map(services.map(service => [service.name, service.id]));
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

  const loadReports = useCallback(async (filters?: ReportsQueryParams) => {
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
  }, [getTagOptionsFromReports])

  const handleExportCsv = async () => {
    try {
      const blob = await reportsService.exportCsv({
        serviceId: selectedServiceId,
        startDate: formatDateForApi(startDate),
        endDate: formatDateForApi(endDate),
        tagName: selectedTagFilter,
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

      setError(
        err instanceof Error ? err.message : 'Failed to export CSV'
      )
    }
  }

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  const renderReleaseDate = (report: ReportVO): string =>
    report.releaseLaunchDate ?? report.releaseCreationDate

  useEffect(() => {
    setSelectedReportIds(prev =>
      prev.filter(id => reports.some(report => report.releaseId === id))
    )
  }, [reports])

  const visibleReportIds = reports.map(report => report.releaseId)
  const allReportsSelected =
    visibleReportIds.length > 0
    && visibleReportIds.every(id => selectedReportIds.includes(id))
  const someReportsSelected = selectedReportIds.length > 0 && !allReportsSelected

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

  const shownReportsCount = reports.length
  const totalReleasesCount = totalReportsCount || shownReportsCount
  const recordsSummary = isShowingFilteredResults
    ? `Showing ${shownReportsCount} of ${totalReleasesCount} releases`
    : `Showing ${shownReportsCount} of ${shownReportsCount} releases`

  return (
    <div className="reports-page">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Reports</Title>
          <Text c="dimmed">
            Generate and export release performance reports across your services.
          </Text>
        </div>

        <Button
          color="orange.6"
          radius="md"
          onClick={() =>
            void loadReports({
              serviceId: selectedServiceId,
              startDate: formatDateForApi(startDate),
              endDate: formatDateForApi(endDate),
              tagName: selectedTagFilter,
            })
          }
        >
          ⚙️ Generate Report
        </Button>
      </Group>

      <Stack gap="md" mt="lg">
        <Group align="flex-end">
          <Text c="dimmed">From</Text>

          <DateInput
            clearable
            ref={startDateInputRef}
            label="Start Date"
            placeholder="--/--/----"
            value={startDate}
            onChange={setStartDate}
            valueFormat="DD/MM/YYYY"
            rightSection={
              <IconCalendar
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => startDateInputRef.current?.focus()}
              />
            }
            rightSectionPointerEvents="all"
            className="date-input"
          />

          <Text c="dimmed">To</Text>

          <DateInput
            clearable
            ref={endDateInputRef}
            label="End Date"
            placeholder="--/--/----"
            value={endDate}
            onChange={setEndDate}
            valueFormat="DD/MM/YYYY"
            rightSection={
              <IconCalendar
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => endDateInputRef.current?.focus()}
              />
            }
            rightSectionPointerEvents="all"
            className="date-input"
          />
        </Group>

        <MultiSelect
          label="Chosen Service"
          placeholder="Choose one service..."
          data={serviceOptions}
          searchable
          clearable
          maxValues={1}
          limit={5}
          w={260}
          value={selectedService ? [selectedService] : []}
          onChange={(values) => {
            const value = values[0] ?? ''
            setSelectedService(value)
            setSelectedServiceId(serviceMap.get(value))
          }}
        />

        <TagsInput
          label="Chosen Tags"
          placeholder="Type a tag and press Enter..."
          data={tagOptions}
          limit={5}
          w={260}
          value={selectedTags}
          onChange={value => setSelectedTags(normalizeTags(value))}
          clearable
        />
      </Stack>

      <Group justify="space-between" mt="xl" mb="sm">
        <Title order={3}>Releases Found</Title>

        <Button
          variant="default"
          radius="md"
          leftSection={<IconDownload size={16} />}
          onClick={() => void handleExportCsv()}
        >
          Export CSV
        </Button>
      </Group>

      {error ? (
        <Text c="red" mb="sm">
          {error}
        </Text>
      ) : null}

      {loading ? (
        <Text c="dimmed" mb="sm">
          Loading reports...
        </Text>
      ) : null}

      <Table verticalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                label="All"
                checked={allReportsSelected}
                indeterminate={someReportsSelected}
                onChange={event => handleToggleAllReports(event.currentTarget.checked)}
              />
            </Table.Th>
            <Table.Th>Release</Table.Th>
            <Table.Th>Version</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Objective</Table.Th>
            <Table.Th>Tags</Table.Th>
            <Table.Th>Release Date</Table.Th>
            <Table.Th>Creation Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {reports.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Checkbox
                  checked={selectedReportIds.includes(item.releaseId)}
                  onChange={event =>
                    handleToggleSingleReport(item.releaseId, event.currentTarget.checked)
                  }
                />
              </Table.Td>
              <Table.Td fw={600}>{item.releaseName}</Table.Td>
              <Table.Td c="dimmed">{item.releaseVersion}</Table.Td>
              <Table.Td>
                {item.services.length ? (
                  <Text c="dimmed" span>
                    {item.services.map((service, serviceIndex) => {
                      const serviceId = serviceMap.get(service.serviceName)
                      const isLast = serviceIndex === item.services.length - 1
                      const separator = isLast ? '' : ', '

                      if (serviceId === undefined) {
                        return (
                          <span key={`${item.releaseId}-${service.serviceName}`}>
                            {service.serviceName}
                            {separator}
                          </span>
                        )
                      }

                      return (
                        <span key={`${item.releaseId}-${service.serviceName}`}>
                          <a
                            href={`/services/${serviceId}`}
                            style={{
                              color: 'inherit',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {service.serviceName}
                          </a>
                          {separator}
                        </span>
                      )
                    })}
                  </Text>
                ) : (
                  <Text c="dimmed">No services</Text>
                )}
              </Table.Td>
              <Table.Td c="dimmed" maw={260}>
                {item.releaseDescription}
              </Table.Td>
              <Table.Td c="dimmed">{item.releaseTags.join(', ')}</Table.Td>
              <Table.Td>{renderReleaseDate(item)}</Table.Td>
              <Table.Td c="dimmed">{item.releaseCreationDate}</Table.Td>
              <Table.Td>
                <Badge
                  color={item.releaseStatus === 'Active' ? 'green' : 'gray'}
                  variant="light"
                  radius="sm"
                >
                  {item.releaseStatus}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="sm">
        <Text c="dimmed">{recordsSummary}</Text>

        
      </Group>
    </div>
  )
}

/*
<Group justify="space-between" mt="sm">
        <Text c="dimmed">Showing 10 of 24 records</Text>

        <Group gap="xs">
          <Button variant="default" size="xs">
            ‹ Prev
          </Button>
          <Button variant="default" size="xs">
            Next ›
          </Button>
        </Group>
      </Group>
*/
