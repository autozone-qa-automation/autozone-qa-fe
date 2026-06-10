/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useGetServices } from '@/hooks/useGetServices'
import { Services } from '@/pages/services/Services'
import { ServicesModalCreate } from '@/pages/services/ServicesModalCreate'
import { servicesService } from '@/services/services.service'

jest.mock('@/services/services.service')
jest.mock('@/hooks/useGetServices')
jest.mock('@mantine/notifications', () => ({ notifications: { show: jest.fn() } }))

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const notify = jest.requireMock('@mantine/notifications').notifications.show as jest.Mock

const fillForm = (name = 'Payment API', urlName = 'Swagger', url = 'https://swagger.io') => {
  fireEvent.change(screen.getByTestId('service-name-input'), { target: { value: name } })
  fireEvent.change(screen.getByTestId('url-nombre-0'), { target: { value: urlName } })
  fireEvent.change(screen.getByTestId('url-url-0'), { target: { value: url } })
}

const submit = () => fireEvent.click(screen.getByTestId('service-submit-btn'))

const setup = (props = {}) =>
  render(
    <MantineProvider>
      <ServicesModalCreate opened onClose={jest.fn()} onSuccess={jest.fn()} {...props} />
    </MantineProvider>
  )

const mockServices = () =>
  (useGetServices as jest.Mock).mockReturnValue({
    services: [],
    loading: false,
    error: null,
    refetch: jest.fn(),
  })

describe('ServicesModalCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockServices()
  })

  test('renders all form fields and buttons', () => {
    setup()
    ;[
      'service-create-form',
      'service-name-input',
      'url-nombre-0',
      'url-url-0',
      'add-url-btn',
      'service-submit-btn',
      'service-cancel-btn',
    ].forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument())
  })

  test('fields update on input', () => {
    setup()
    fillForm()
    expect(screen.getByTestId('service-name-input')).toHaveValue('Payment API')
    expect(screen.getByTestId('url-nombre-0')).toHaveValue('Swagger')
    expect(screen.getByTestId('url-url-0')).toHaveValue('https://swagger.io')
  })

  test('Add URL adds a new row', () => {
    setup()
    fireEvent.click(screen.getByTestId('add-url-btn'))
    expect(screen.getByTestId('url-nombre-1')).toBeInTheDocument()
    expect(screen.getByTestId('remove-url-1')).toBeInTheDocument()
  })

  test('remove button deletes the row', () => {
    setup()
    fireEvent.click(screen.getByTestId('add-url-btn'))
    fireEvent.click(screen.getByTestId('remove-url-1'))
    expect(screen.queryByTestId('url-nombre-1')).not.toBeInTheDocument()
  })

  test('shows validation error for short or empty name', async () => {
    setup()
    fireEvent.change(screen.getByTestId('service-name-input'), { target: { value: 'A' } })
    submit()
    await waitFor(() =>
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
    )
    expect(servicesService.create as jest.Mock).not.toHaveBeenCalled()
  })

  test('successful submit calls service, shows success notification and onSuccess', async () => {
    const onSuccess = jest.fn().mockResolvedValue(undefined)
    ;(servicesService.create as jest.Mock).mockResolvedValue({ id: 1 })
    setup({ onSuccess })
    fillForm()
    submit()
    await waitFor(() => {
      expect(servicesService.create as jest.Mock).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Payment API' })
      )
      expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success!' }))
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  test('API error shows error notification', async () => {
    ;(servicesService.create as jest.Mock).mockRejectedValue(new Error('Service already exists'))
    setup()
    fillForm()
    submit()
    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', message: 'Service already exists' })
      )
    )
  })

  test('cancel calls onClose', () => {
    const onClose = jest.fn()
    setup({ onClose })
    fireEvent.click(screen.getByTestId('service-cancel-btn'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('Services page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockServices()
  })

  test('New Service button opens the modal', async () => {
    render(
      <MantineProvider>
        <Services />
      </MantineProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /new service/i }))
    await waitFor(() => expect(screen.getByTestId('service-create-form')).toBeInTheDocument())
  })
})
