/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useCallback, useEffect, useRef, useState } from 'react'
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
  addUser: (user: User) => void
  removeUser: (id: number | string) => void
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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const initialLoadDone = useRef(false)

  /**
   * Funcion para fetchear
   * todos los usuarios onCallback
   */
  const fetchUsers = useCallback(async (): Promise<void> => {
    if (!initialLoadDone.current) setLoading(true)
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
      initialLoadDone.current = true
    }
  }, [])

  /**
   * Effect para hacer un trigger
   * del refetch cuando se llame
   */
  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const addUser = useCallback((user: User) => {
    setUsers(prev => {
      const existingRole = prev.find(u => u.roleId === user.roleId)?.rolePermission
      const rolePermission = user.rolePermission?.permission
        ? user.rolePermission
        : (existingRole ?? user.rolePermission)
      return [...prev, { ...user, rolePermission }]
    })
  }, [])

  const removeUser = useCallback((id: number | string) => {
    setUsers(prev => prev.filter(u => u.id !== Number(id)))
  }, [])

  return { users, loading, error, refetch: fetchUsers, addUser, removeUser }
}
