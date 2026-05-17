/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { userService } from '@/services/user.service'
import type { User } from '@/types/user.types'

export const useGetUsers = () => {
  /**
   * Constants to hold the hook data
   * the users, loading states and error states
   */
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Callback function to fetch
   * the users from the userService onMount
   * or when the refetch functions called
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const request = await userService.getAll()
      setUsers(request)
    } catch (e) {
      const error =
        e instanceof Error ? e.message : 'Something unexpected happened while loading users!'
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * useEffect to trigger
   * a refetch of the users
   */
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}
