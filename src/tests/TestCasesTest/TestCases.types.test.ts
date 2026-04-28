/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { createTestCaseSchema } from '@/types/TestCases.types'

const getValidBase = () => ({
  title: 'Login Test',
  relatedFeature: 1,
  steps: 'Paso 1. Abrir app',
  expectedOutput: 'Acceso concedido',
  type: 'REGRESSION' as const,
})

describe('createTestCaseSchema', () => {
  describe('casos válidos', () => {
    it('acepta un objeto completo', () => {
      const result = createTestCaseSchema.safeParse({
        ...getValidBase(),
        description: 'Descripción',
        preconditions: 'Precondiciones',
        inputs: 'Inputs',
        postconditions: 'Postcondiciones',
      })
      expect(result.success).toBe(true)
    })

    it('rellena los opcionales con string vacío por defecto', () => {
      const result = createTestCaseSchema.safeParse(getValidBase())
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).toBe('')
      }
    })
  })

  describe('validaciones de campos', () => {
    it('falla si title supera 30 caracteres', () => {
      const result = createTestCaseSchema.safeParse({ ...getValidBase(), title: 'a'.repeat(31) })
      expect(result.success).toBe(false)
    })

    it('falla si relatedFeature no es número', () => {
      const result = createTestCaseSchema.safeParse({
        ...getValidBase(),
        relatedFeature: 'abc' as unknown as number,
      })
      expect(result.success).toBe(false)
    })

    it('falla con un valor de tipo no permitido', () => {
      const result = createTestCaseSchema.safeParse({
        ...getValidBase(),
        type: 'SMOKE' as unknown as 'REGRESSION',
      })
      expect(result.success).toBe(false)
    })
  })
})
