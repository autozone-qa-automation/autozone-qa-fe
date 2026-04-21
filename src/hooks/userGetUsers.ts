/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import type { User } from '../types/user.types'

/**
 * Interfaz describiendo el objeto
 * de respuesta que devuelve el hook
 */
interface IUseGetAllUsersResponse {
  users: User[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para obtener la lista de todos los usuarios.
 * @returns {IUseGetAllUsersResponse} Estado de la petición con los usuarios, loading, error y refetch
 */
export const useGetAllUsers = (): IUseGetAllUsersResponse => {
  /**
   * Estados para controlar los usuarios,
   * estados de carga y de errores
   */
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Funcion para fetchear
   * todos los usuarios onCallback
   */
  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Effect para hacer un trigger
   * del refetch cuando se llame
   */
  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}
