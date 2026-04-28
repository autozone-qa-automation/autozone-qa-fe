/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { MantineProvider } from '@mantine/core'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTestCases } from '@/hooks/useCreateTestCase'
import { TestCasesModalCreate } from '@/pages/tests-cases/TestCasesModalCreate'
import { featureService } from '@/services/features.service'

interface Feature {
  id: number
  featureName: string
  featureDescription: string
  idService: number
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

jest.mock('@/hooks/useCreateTestCase')
jest.mock('@/services/features.service')
jest.mock('@mantine/notifications', () => ({
  showNotification: jest.fn(),
}))

jest.mock('@/components/ui/ModalTemplate/ModalTemplate', () => ({
  ModalTemplate: ({ children, opened }: { children: React.ReactNode; opened: boolean }) =>
    opened ? <div>{children}</div> : null,
}))

const mockUseTestCases = useTestCases as jest.MockedFunction<typeof useTestCases>
const mockFeatureService = featureService as jest.Mocked<typeof featureService>

describe('TestCasesModalCreate', () => {
  const createMock = jest.fn().mockResolvedValue(true)

  beforeEach(() => {
    jest.clearAllMocks()

    const mockFeaturesData: Feature[] = [
      { id: 1, featureName: 'Login', featureDescription: 'Test login', idService: 123 },
    ]

    mockFeatureService.getAll.mockResolvedValue(mockFeaturesData)

    mockUseTestCases.mockReturnValue({
      create: createMock,
      loading: false,
      error: null,
    })
  })

  it('llama a la función create con los datos correctos y limpia el formulario', async () => {
    const user = userEvent.setup()

    render(
      <MantineProvider>
        <TestCasesModalCreate opened={true} onClose={jest.fn()} />
      </MantineProvider>
    )
    await user.type(screen.getByLabelText(/NAME/i), 'Prueba de Login')
    await user.type(screen.getByLabelText(/STEPS/i), '1. Abrir navegador')
    await user.type(screen.getByLabelText(/EXPECTED OUTPUT/i), 'Sesión iniciada')

    const select = screen.getByPlaceholderText(/Buscar o seleccionar feature/i)
    await user.click(select)

    const option = await screen.findByText('Login')
    await user.click(option)

    const submitBtn = screen.getByRole('button', { name: /Crear Test Case/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/NAME/i)).toHaveValue('')
    })
  })
})
