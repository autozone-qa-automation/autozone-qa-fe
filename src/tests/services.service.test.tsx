/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { apiService } from '../services/api.service'
import { servicesService } from '../services/services.service'

jest.mock('../services/api.service')

const getSpy = apiService['get'] as jest.Mock

const mockServicesFromDB = [
  { id: 1, name: 'Backend', description: 'Creacion de base de datos' },
  { id: 2, name: 'Frontend', description: 'Desarrollo de interfaces de usuario' },
  { id: 16, name: 'AI', description: 'Entrenamiento de modelos de lenguaje' },
]

describe('servicesService - Integración con SQL Data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe mapear correctamente los servicios del backend (incluyendo AI)', async () => {
    getSpy.mockResolvedValue(mockServicesFromDB)

    const services = await servicesService.getAll()

    expect(services).toHaveLength(3)
    const aiService = services.find(s => s.id === 16)
    expect(aiService?.name).toBe('AI')
    expect(aiService?.description).toContain('modelos de lenguaje')
  })

  it('debe validar un servicio individual por ID', async () => {
    getSpy.mockResolvedValue(mockServicesFromDB[1])

    const service = await servicesService.getById(2)

    expect(service.name).toBe('Frontend')

    expect(getSpy).toHaveBeenCalledWith('/services/2')
  })
})
