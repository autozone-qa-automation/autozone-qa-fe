/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import './Reports.css'
import {
  Badge,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Stack,
  Table,
  TagsInput,
  Text,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { IconCalendar, IconDownload } from '@tabler/icons-react'
import { useRef } from 'react'
import { useReports } from '@/hooks/useReports'
import type { ReportVO } from '@/models/ReportVO'

export function Reports() {
  const {
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
  } = useReports()

  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const renderReleaseDate = (report: ReportVO): string =>
    report.releaseLaunchDate ?? report.releaseCreationDate

  return (
    <div data-testid="reports-page-container" className="reports-page">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Reports</Title>
          <Text c="dimmed">
            Generate and export release performance reports across your services.
          </Text>
        </div>

        <Button data-testid="generate-report-btn" color="orange.6" radius="md" onClick={() => void handleGenerateReport()}>
          ⚙️ Generate Report
        </Button>
      </Group>

      <Stack gap="md" mt="lg">
        <Group align="flex-end">
          <Text c="dimmed">From</Text>

          <DateInput
            data-testid="reports-start-date-input"
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
            data-testid="reports-end-date-input"
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
          data-testid="reports-service-select"
          label="Chosen Service"
          placeholder="Choose one service..."
          data={serviceOptions}
          searchable
          clearable
          maxValues={1}
          limit={5}
          w={260}
          value={selectedService ? [selectedService] : []}
          onChange={handleServiceChange}
        />

        <TagsInput
          data-testid="reports-tags-input"
          label="Chosen Tags"
          placeholder="Type a tag and press Enter..."
          data={tagOptions}
          limit={5}
          w={260}
          value={selectedTags}
          onChange={handleTagsChange}
          clearable
        />
      </Stack>

      <Group justify="space-between" mt="xl" mb="sm">
        <Title order={3}>Releases Found</Title>

        <Button
          data-testid="export-csv-btn"
          variant="default"
          radius="md"
          leftSection={<IconDownload size={16} />}
          onClick={() => void handleExportCsv()}
        >
          Export CSV
        </Button>
      </Group>

      {error ? (
        <Text data-testid="reports-error-message" c="red" mb="sm">
          {error}
        </Text>
      ) : null}

      {loading ? (
        <Text data-testid="reports-loading-message" c="dimmed" mb="sm">
          Loading reports...
        </Text>
      ) : null}

      <Table data-testid="reports-table" verticalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                data-testid="reports-select-all-checkbox"
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
            <Table.Tr data-testid={`report-row-${index}`} key={index}>
              <Table.Td>
                <Checkbox
                  data-testid={`report-row-checkbox-${index}`}
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
        <Text data-testid="reports-records-summary" c="dimmed">{recordsSummary}</Text>
      </Group>
    </div>
  )
}