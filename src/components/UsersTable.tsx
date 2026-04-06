/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import '../styles/UsersTable.css'
import { useState } from 'react'
import { FaEye, FaPlus } from 'react-icons/fa'
import { useGetAllUsers } from '@/hooks/userGetUsers'
import type { User } from '../VOs/user.types'
import { UserCreateModal } from './UserCreateModal'
import { UserDetailModal } from './UserDetailModal'

/**
 * Componente de tabla de usuarios.
 * Muestra la lista de usuarios con opción de ver, editar y crear usuarios.
 */
export const UsersTable = () => {
  const { users, loading, error, refetch } = useGetAllUsers()

  /**
   * Estado para el usuario seleccionado (modal de detalle)
   */
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  /**
   * Estado para controlar la apertura del modal de creación
   */
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <>
      <div className="table-header">
        <h1 className="table-title">Users</h1>
        <button className="add-btn" onClick={() => setIsCreateOpen(true)}>
          <FaPlus />
          Add User
        </button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: User, index: number) => (
            <tr key={user.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="action-btn" onClick={() => setSelectedUserId(user.id)}>
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId !== null && (
        <UserDetailModal
          id={selectedUserId}
          onClose={() => {
            setSelectedUserId(null)
            void refetch()
          }}
        />
      )}

      {isCreateOpen && (
        <UserCreateModal
          onClose={() => {
            setIsCreateOpen(false)
            void refetch()
          }}
        />
      )}
    </>
  )
}
