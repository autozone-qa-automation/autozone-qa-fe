/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { ServicesList } from '../pages/services/ServicesId/ServicesList'

// Definimos la estructura del objeto para evitar el uso de 'any'
interface Feature {
  idFeature: number
  nombre: string
}

const mockFeaturesBackend: Feature[] = [
  { idFeature: 1, nombre: 'Gestión de usuarios' },
  { idFeature: 2, nombre: 'Autenticación' },
  { idFeature: 3, nombre: 'Roles y permisos' },
  { idFeature: 4, nombre: 'Auditoría' },
  { idFeature: 5, nombre: 'API interna' },
]

describe('<ServicesList />', () => {
  // Cambiamos 'any[]' por 'Feature[]'
  const setup = (data: Feature[]) =>
    render(
      <MantineProvider>
        <ServicesList data={data} />
      </MantineProvider>
    )

  it('debe mostrar el número correcto de features vinculadas', () => {
    setup(mockFeaturesBackend)

    expect(screen.getByText(/• 5 features/i)).toBeInTheDocument()
  })

  it('debe listar los nombres de las features correctamente', () => {
    setup(mockFeaturesBackend)

    expect(screen.getByText('Gestión de usuarios')).toBeInTheDocument()
    expect(screen.getByText('API interna')).toBeInTheDocument()
  })

  it('debe mostrar mensaje vacío cuando no hay features', () => {
    setup([])
    expect(screen.getByText(/No hay features vinculadas/i)).toBeInTheDocument()
  })
})
