/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { useReports } from '@/hooks/useReports'
import { ReportVO } from '@/models/ReportVO'
import { Reports } from '@/pages/reports/Reports'

jest.mock('@/hooks/useReports')

const mockReports = [
  new ReportVO({
    releaseId: 1,
    releaseName: 'Release 1',
    releaseDescription: 'Login improvements',
    releaseVersion: '1.0.0',
    releaseStatus: 'Active',
    releaseTags: ['login'],
    releaseCreationDate: '2026-01-01',
    releaseLaunchDate: '2026-01-10',
    services: [
      {
        serviceName: 'Auth Service',
        features: [],
      },
    ],
  }),
]

const mockUseReports = (overrides = {}) =>
  jest.mocked(useReports).mockReturnValue({
    startDate: null,
    endDate: null,
    selectedService: '',
    selectedTags: [],
    selectedReportIds: [],
    reports: mockReports,

    serviceOptions: ['Auth Service'],
    serviceMap: new Map([['Auth Service', 1]]),

    tagOptions: ['login'],

    loading: false,
    error: null,

    allReportsSelected: false,
    someReportsSelected: false,

    recordsSummary: 'Showing 1 of 1 releases',

    setStartDate: jest.fn(),
    setEndDate: jest.fn(),

    handleServiceChange: jest.fn(),
    handleTagsChange: jest.fn(),

    handleToggleAllReports: jest.fn(),
    handleToggleSingleReport: jest.fn(),

    handleGenerateReport: jest.fn(),
    handleExportCsv: jest.fn(),

    ...overrides,
  })

const renderComponent = () =>
  render(
    <MantineProvider>
      <Reports />
    </MantineProvider>
  )

describe('Reports page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseReports()
  })

  it('renders page title', () => {
    renderComponent()

    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders report row', () => {
    renderComponent()

    expect(screen.getByText('Release 1')).toBeInTheDocument()
    expect(screen.getByText('1.0.0')).toBeInTheDocument()
    expect(screen.getByText('Login improvements')).toBeInTheDocument()
  })

  it('renders records summary', () => {
    renderComponent()

    expect(screen.getByText('Showing 1 of 1 releases')).toBeInTheDocument()
  })

  it('shows loading message', () => {
    mockUseReports({
      loading: true,
    })

    renderComponent()

    expect(screen.getByText('Loading reports...')).toBeInTheDocument()
  })

  it('shows error message', () => {
    mockUseReports({
      error: 'Failed to fetch reports',
    })

    renderComponent()

    expect(screen.getByText('Failed to fetch reports')).toBeInTheDocument()
  })

  it('calls handleGenerateReport when Generate Report button is clicked', () => {
    const handleGenerateReport = jest.fn()

    mockUseReports({
      handleGenerateReport,
    })

    renderComponent()

    fireEvent.click(screen.getByText(/Generate Report/i))

    expect(handleGenerateReport).toHaveBeenCalledTimes(1)
  })

  it('calls handleExportCsv when Export CSV button is clicked', () => {
    const handleExportCsv = jest.fn()

    mockUseReports({
      handleExportCsv,
    })

    renderComponent()

    fireEvent.click(screen.getByText(/Export CSV/i))

    expect(handleExportCsv).toHaveBeenCalledTimes(1)
  })

  it('calls handleToggleAllReports when All checkbox is clicked', () => {
    const handleToggleAllReports = jest.fn()

    mockUseReports({
      handleToggleAllReports,
    })

    renderComponent()

    fireEvent.click(screen.getByLabelText('All'))

    expect(handleToggleAllReports).toHaveBeenCalled()
  })

  it('calls handleToggleSingleReport when row checkbox is clicked', () => {
    const handleToggleSingleReport = jest.fn()

    mockUseReports({
      handleToggleSingleReport,
    })

    renderComponent()

    const checkboxes = screen.getAllByRole('checkbox')

    fireEvent.click(checkboxes[1]!)

    expect(handleToggleSingleReport).toHaveBeenCalled()
  })

  it('renders service link when service exists in serviceMap', () => {
    renderComponent()

    const link = screen.getByRole('link', {
      name: 'Auth Service',
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/services/1')
  })

  it('renders service name without link when service is not in serviceMap', () => {
    mockUseReports({
      serviceMap: new Map(),
      reports: [
        new ReportVO({
          releaseId: 2,
          releaseName: 'Release 2',
          releaseDescription: 'Description',
          releaseVersion: '2.0.0',
          releaseStatus: 'Draft',
          releaseTags: [],
          releaseCreationDate: '2026-02-01',
          releaseLaunchDate: null,
          services: [
            {
              serviceName: 'Unknown Service',
              features: [],
            },
          ],
        }),
      ],
    })

    renderComponent()

    expect(screen.getByText('Unknown Service')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Unknown Service' })).not.toBeInTheDocument()
  })
})
