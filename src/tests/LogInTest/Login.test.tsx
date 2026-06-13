/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { useLogin } from '@/hooks/useLogin'
import { Login } from '@/pages/login/Login'

const mockNavigate = jest.fn()
jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useLogin
jest.mock('@/hooks/useLogin', () => ({
  useLogin: jest.fn(),
}))

// Mock window.matchMedia for Mantine
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('Login Component', () => {
  const mockLogin = jest.fn()
  const defaultUseLoginMock = {
    login: mockLogin,
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLogin as jest.Mock).mockReturnValue(defaultUseLoginMock)
    localStorage.clear()
    window.alert = jest.fn()
  })

  const renderComponent = () =>
    render(
      <MantineProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MantineProvider>
    )

  it('debe mostrar el formulario de inicio de sesión', () => {
    renderComponent()

    expect(screen.getByTestId('login-page-title')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByTestId('login-submit-button')).toBeInTheDocument()
  })

  it('debe redirigir a "/" si ya existe un authToken en localStorage', () => {
    localStorage.setItem('authToken', 'test-token')
    renderComponent()

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('debe llamar a login con los valores del formulario', async () => {
    mockLogin.mockResolvedValue({ id: 1, email: 'test@example.com' })
    renderComponent()

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByTestId('login-submit-button'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        mail: 'test@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('no debe llamar a login si el formulario es inválido', async () => {
    renderComponent()

    fireEvent.click(screen.getByTestId('login-submit-button'))

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('debe mostrar una alerta si hay un error en el login', () => {
    ;(useLogin as jest.Mock).mockReturnValue({
      ...defaultUseLoginMock,
      error: 'Invalid credentials',
    })

    renderComponent()

    expect(window.alert).toHaveBeenCalledWith('Error logging in: Invalid credentials')
  })
})
