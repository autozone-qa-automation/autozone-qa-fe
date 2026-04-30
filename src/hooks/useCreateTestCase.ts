/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { useState } from 'react'
import { createTestCase } from '@/services/TestCaseService'
import { type CreateTestCaseRequest } from '@/types/TestCases.types'

export function useTestCases() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: CreateTestCaseRequest): Promise<boolean> => {
    setError(null)
    setLoading(true)
    try {
      await createTestCase(data)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creando test case'
      setError(message)
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}
