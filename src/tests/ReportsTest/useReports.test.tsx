import { act, renderHook, waitFor } from '@testing-library/react'
import { useGetServices } from '@/hooks/useGetServices'
import { useReports } from '@/hooks/useReports'
import { ReportVO } from '@/models/ReportVO'
import { reportsService } from '@/services/reports.service'

jest.mock('@/services/reports.service', () => ({
  reportsService: {
    exportCsv: jest.fn(),
    getAllVO: jest.fn(),
  },
}))

jest.mock('@/hooks/useGetServices', () => ({
  useGetServices: jest.fn(),
}))

const mockServices = [
  { id: 1, name: 'Service A' },
  { id: 2, name: 'Service B' },
]

const mockReportsData = [
  new ReportVO({
    releaseId: 10,
    releaseName: 'Release 1',
    releaseDescription: 'First release',
    releaseVersion: '1.0.0',
    releaseStatus: 'Active',
    releaseTags: ['tag1'],
    releaseCreationDate: '2024-01-15',
    releaseLaunchDate: '2024-02-01',
    services: [{ serviceName: 'Service A', features: [] }],
  }),
  new ReportVO({
    releaseId: 20,
    releaseName: 'Release 2',
    releaseDescription: 'Second release',
    releaseVersion: '2.0.0',
    releaseStatus: 'Draft',
    releaseTags: [],
    releaseCreationDate: '2024-03-10',
    releaseLaunchDate: null,
    services: [],
  }),
]

describe('useReports - handleExportCsv', () => {
  beforeAll(() => {
    Object.defineProperty(window.URL, 'createObjectURL', {
      value: jest.fn(),
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: jest.fn(),
      writable: true,
      configurable: true,
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGetServices as jest.Mock).mockReturnValue({
      services: mockServices,
      loading: false,
      error: null,
      refetch: jest.fn(),
    })
    ;(reportsService.getAllVO as jest.Mock).mockResolvedValue(mockReportsData)
  })

  it('debe establecer error cuando no hay releases seleccionados', async () => {
    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(result.current.error).toBe('Select at least one release to export')
    expect(reportsService.exportCsv).not.toHaveBeenCalled()
  })

  it('debe llamar al servicio exportCsv con los releaseIds seleccionados', async () => {
    ;(reportsService.exportCsv as jest.Mock).mockResolvedValue(new Blob())

    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleToggleSingleReport(10, true)
    })

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(reportsService.exportCsv).toHaveBeenCalledWith({ releaseIds: '10' })
    expect(result.current.error).toBeNull()
  })

  it('debe enviar múltiples releaseIds separados por coma', async () => {
    ;(reportsService.exportCsv as jest.Mock).mockResolvedValue(new Blob())

    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleToggleSingleReport(10, true)
      result.current.handleToggleSingleReport(20, true)
    })

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(reportsService.exportCsv).toHaveBeenCalledWith({ releaseIds: '10,20' })
  })

  it('debe mantener el error en null después de una exportación exitosa habiendo tenido error previo', async () => {
    ;(reportsService.exportCsv as jest.Mock).mockResolvedValue(new Blob())

    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(result.current.error).toBe('Select at least one release to export')

    act(() => {
      result.current.handleToggleSingleReport(10, true)
    })

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(result.current.error).toBeNull()
  })

  it('debe manejar error cuando la exportación falla', async () => {
    const apiError = new Error('Server error')
    ;(reportsService.exportCsv as jest.Mock).mockRejectedValue(apiError)
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleToggleSingleReport(10, true)
    })

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(result.current.error).toBe('Server error')
    expect(consoleErrorSpy).toHaveBeenCalledWith(apiError)

    consoleErrorSpy.mockRestore()
  })

  it('debe manejar error con mensaje genérico cuando no es una instancia de Error', async () => {
    ;(reportsService.exportCsv as jest.Mock).mockRejectedValue('Raw error string')
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useReports())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleToggleSingleReport(10, true)
    })

    await act(async () => {
      await result.current.handleExportCsv()
    })

    expect(result.current.error).toBe('Failed to export CSV')

    consoleErrorSpy.mockRestore()
  })
})
