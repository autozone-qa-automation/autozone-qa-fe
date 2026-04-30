/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '@testing-library/jest-dom'
import { MantineProvider } from '@mantine/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useCreateFeature } from '@/hooks/useCreateFeature'
import { useFeatureFormResources } from '@/hooks/useFeatureFormResources'
import { FeatureModalCreate } from '@/pages/features/FeatureModalCreate'

jest.mock('@/hooks/useFeatureFormResources')
jest.mock('@/hooks/useCreateFeature')

interface MockSelectProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
}

jest.mock('@mantine/core', () => {
  const original = jest.requireActual('@mantine/core')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    Select: ({ placeholder, value, onChange }: MockSelectProps) => (
      <input
        data-testid="mock-select"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ),
  }
})

describe('FeatureModalCreate Component', () => {
  const mockCreateFeature = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFeatureFormResources as jest.Mock).mockReturnValue({
      servicesOptions: [{ value: '1', label: 'Service A' }],
      loading: false,
      error: null,
    })
    ;(useCreateFeature as jest.Mock).mockReturnValue({
      createFeature: mockCreateFeature,
      loading: false,
    })
  })

  const setup = () => {
    return render(
      <MantineProvider>
        <FeatureModalCreate />
      </MantineProvider>
    )
  }

  test('debe llamar a createFeature con los datos correctos al enviar', async () => {
    mockCreateFeature.mockResolvedValue(true)
    setup()

    fireEvent.click(screen.getByText('+ New Feature'))

    const nameInput = await screen.findByPlaceholderText('e.g. Refund Processing')
    fireEvent.change(nameInput, { target: { value: 'Funcionalidad Test' } })

    const descInput = screen.getByPlaceholderText('Describe the feature scope and purpose...')
    fireEvent.change(descInput, { target: { value: 'Descripción válida' } })

    const select = screen.getByTestId('mock-select')
    fireEvent.change(select, { target: { value: '1' } })

    const submitBtn = screen.getByText('Create Feature')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockCreateFeature).toHaveBeenCalledWith(
        expect.objectContaining({
          featureName: 'Funcionalidad Test',
          idService: 1,
        })
      )
    })
  })
})
