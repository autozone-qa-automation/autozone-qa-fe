/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReleaseData } from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { ReleasesModalStatus } from '@/pages/releases/ReleasesModalStatus'

interface MockSelectProps {
  data: Array<{ label: string; value: string; disabled?: boolean }>
  value?: string | null
  onChange: (value: string | null) => void
}

jest.mock('@mantine/core', () => {
  const original = jest.requireActual('@mantine/core')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    Select: ({ data, value, onChange }: MockSelectProps) => (
      <select
        data-testid="status-select"
        value={value ?? ''}
        onChange={event => onChange(event.target.value)}
      >
        {data.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  }
})

describe('ReleasesModalStatus Component', () => {
  const release: ReleaseData = {
    releaseId: 2,
    title: 'Bugfix Alpha',
    objective: 'Corrección de bugs menores',
    version: '1.2.1',
    tags: 'hotfix',
    creationDate: '2024-05-10',
    releaseDate: '',
    status: 'Draft',
    service: 'Inventory Manager',
    serviceId: 3,
  }

  const renderComponent = (onUpdateStatus = jest.fn()) =>
    render(
      <MantineProvider>
        <ReleasesModalStatus
          opened
          onClose={jest.fn()}
          release={release}
          loading={false}
          onUpdateStatus={onUpdateStatus}
        />
      </MantineProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe mostrar la información del release', () => {
    renderComponent()

    expect(screen.getByText('Status of release')).toBeInTheDocument()
    expect(screen.getByText('Corrección de bugs menores')).toBeInTheDocument()
    expect(screen.getByText('1.2.1')).toBeInTheDocument()
  })

  it('debe llamar a onUpdateStatus al confirmar un cambio válido', async () => {
    const onUpdateStatus = jest.fn().mockResolvedValue(undefined)

    renderComponent(onUpdateStatus)

    fireEvent.change(screen.getByTestId('status-select'), {
      target: { value: 'Progress' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    const confirmButton = await screen.findByRole('button', { name: 'Sí' })

    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(onUpdateStatus).toHaveBeenCalledWith(2, 'Progress')
    })
  })
})
