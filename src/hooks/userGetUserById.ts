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
interface IUseGetUserByIdResponse {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para obtener un usuario por su ID.
 * @param {number} id - El ID del usuario a obtener
 * @returns {IUseGetUserByIdResponse} Estado de la petición con el usuario, loading, error y refetch
 */
export const useGetUserById = (id: number): IUseGetUserByIdResponse => {
  /**
   * Estados para controlar el usuario,
   * estados de carga y de errores
   */
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Funcion para fetchear
   * el usuario por ID onCallback
   */
  const fetchUserById = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getById(id)
      setUser(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  /**
   * Effect para hacer un trigger
   * del fetch cuando el id cambie
   */
  useEffect(() => {
    void fetchUserById()
  }, [fetchUserById])

  return { user, loading, error, refetch: fetchUserById }
}
