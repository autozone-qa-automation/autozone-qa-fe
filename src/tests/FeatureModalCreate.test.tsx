/* eslint-disable @typescript-eslint/no-unsafe-return */

/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Autozone QA Automation - THE FINAL STABLE VERSION
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

  // NOTA: Quitamos el 'async'. El Linter ya no puede molestarnos.
  test('debe llamar a createFeature con los datos correctos al enviar', () => {
    mockCreateFeature.mockResolvedValue(true)
    setup()

    fireEvent.click(screen.getByText('+ New Feature'))

    // Usamos 'return waitFor' para manejar la asincronía sin usar la palabra 'async'
    return waitFor(() => {
      const nameInput = screen.getByPlaceholderText('e.g. Refund Processing')
      fireEvent.change(nameInput, { target: { value: 'Funcionalidad Test' } })

      const select = screen.getByTestId('mock-select')
      fireEvent.change(select, { target: { value: '1' } })

      const submitBtn = screen.getByText('Create Feature')
      fireEvent.click(submitBtn)

      expect(mockCreateFeature).toHaveBeenCalledWith(
        expect.objectContaining({
          featureName: 'Funcionalidad Test',
          idService: 1,
        })
      )
    })
  })
})
