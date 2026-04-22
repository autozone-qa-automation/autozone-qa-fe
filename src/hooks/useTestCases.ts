import { useEffect, useState } from 'react'
import type { TestCaseItem } from '../pages/tests-cases/TestCasesList'

export function useTestCases() {
  const [testCases, setTestCases] = useState<TestCaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/test-cases')

        const json: unknown = await res.json()
        const data = json as TestCaseItem[]

        setTestCases(data)
      } catch (err) {
        setError(err)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { testCases, loading, error }
}
