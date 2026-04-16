/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import '../styles/UsersTable.css'
import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useGetUserById } from '@/hooks/userGetUserById'
import { userService } from '@/services/userService'
import type { UserUpdateRequest } from '../VOs/user.types'

interface IUserDetailModalProps {
  id: number
  onClose: () => void
}

/**
 * Modal para ver y editar los detalles de un usuario.
 * @param {number} id - ID del usuario a mostrar
 * @param {() => void} onClose - Callback para cerrar el modal
 */
export const UserDetailModal = ({ id, onClose }: IUserDetailModalProps) => {
  const { user, loading, error } = useGetUserById(id)

  /**
   * Estado del form inicializado con
   * los valores del usuario cargado
   */
  const [formData, setFormData] = useState<UserUpdateRequest>({
    name: '',
    email: '',
  })

  /**
   * Estado de loading y error para actualización
   */
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  /**
   * Sincroniza el form con los datos del usuario
   */
  useEffect(() => {
    if (!loading && user) {
      setFormData({ name: user.name, email: user.email })
    }
  }, [loading, user])

  const handleChange =
    (field: keyof UserUpdateRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true)
      setSaveError(null)

      await userService.update(id, formData)
      onClose()
    } catch (err) {
      console.error('Error al actualizar usuario: ', err)
      setSaveError('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading)
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Error: {error}</p>
        </div>
      </div>
    )

  if (!user) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-actions-wrapper">
          <h2>User Details</h2>
          <button className="modal-close" onClick={onClose} disabled={isSaving}>
            <FaTimes color="#fff" />
          </button>
        </div>

        {saveError && <p className="error-text">{saveError}</p>}

        <label>
          Name
          <input value={formData.name ?? ''} onChange={handleChange('name')} disabled={isSaving} />
        </label>

        <label>
          Email
          <input
            value={formData.email ?? ''}
            onChange={handleChange('email')}
            disabled={isSaving}
          />
        </label>

        <button onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
