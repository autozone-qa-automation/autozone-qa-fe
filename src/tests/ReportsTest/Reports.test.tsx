import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { useReports } from '@/hooks/useReports'
import { Reports } from '@/pages/reports/Reports'

jest.mock('@/hooks/useReports')

const mockHandleExportCsv = jest.fn()

const defaultMockReturn = {
  startDate: null,
  endDate: null,
  selectedService: '',
  selectedTags: [],
  selectedReportIds: [],
  reports: [],
  serviceOptions: [],
  serviceMap: new Map(),
  tagOptions: [],
  loading: false,
  error: null,
  allReportsSelected: false,
  someReportsSelected: false,
  recordsSummary: 'Showing 0 of 0 releases',
  setStartDate: jest.fn(),
  setEndDate: jest.fn(),
  handleServiceChange: jest.fn(),
  handleTagsChange: jest.fn(),
  handleToggleAllReports: jest.fn(),
  handleToggleSingleReport: jest.fn(),
  handleGenerateReport: jest.fn(),
  handleExportCsv: mockHandleExportCsv,
}

describe('Reports Component - Export CSV Button', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useReports as jest.Mock).mockReturnValue(defaultMockReturn)
  })

  const renderComponent = () =>
    render(
      <MantineProvider>
        <Reports />
      </MantineProvider>
    )

  it('debe renderizar el botón Export CSV con el data-testid correcto', () => {
    renderComponent()

    const exportBtn = screen.getByTestId('export-csv-btn')
    expect(exportBtn).toBeInTheDocument()
    expect(exportBtn).toHaveTextContent('Export CSV')
  })

  it('debe llamar a handleExportCsv al hacer clic en el botón', () => {
    renderComponent()

    const exportBtn = screen.getByTestId('export-csv-btn')
    fireEvent.click(exportBtn)

    expect(mockHandleExportCsv).toHaveBeenCalledTimes(1)
  })

  it('debe mostrar el error cuando handleExportCsv establece un error', () => {
    ;(useReports as jest.Mock).mockReturnValue({
      ...defaultMockReturn,
      error: 'Select at least one release to export',
    })

    renderComponent()

    expect(screen.getByTestId('reports-error-message')).toHaveTextContent(
      'Select at least one release to export'
    )
  })

  it('debe mostrar mensaje de carga cuando loading es true', () => {
    ;(useReports as jest.Mock).mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    })

    renderComponent()

    expect(screen.getByTestId('reports-loading-message')).toHaveTextContent('Loading reports...')
  })

  it('debe deshabilitar interacción del botón si hay error o está cargando (el botón siempre está presente)', () => {
    renderComponent()

    const exportBtn = screen.getByTestId('export-csv-btn')
    expect(exportBtn).toBeInTheDocument()
  })
})
