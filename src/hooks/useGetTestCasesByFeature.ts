/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'

interface UseTestCasesState {
  testCases: TestCaseVO[]
  isLoading: boolean
  error: string | null
}

interface UseTestCasesReturn extends UseTestCasesState {
  refetch: () => Promise<void>
}

export const useGetTestCasesByFeature = (featureId: number): UseTestCasesReturn => {
  const [state, setState] = useState<UseTestCasesState>({
    testCases: [],
    isLoading: true,
    error: null,
  })

  const fetchTestCasesByFeatureId = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const rawData = await testCaseService.getByFeatureId(featureId)
      setState({
        testCases: rawData?.map(tc => new TestCaseVO(tc)),
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch test cases',
      }))
    }
  }, [featureId])

  useEffect(() => {
    fetchTestCasesByFeatureId()
  }, [fetchTestCasesByFeatureId])

  return {
    ...state,
    refetch: fetchTestCasesByFeatureId,
  }
}
