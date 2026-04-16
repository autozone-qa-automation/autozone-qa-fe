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
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { userService } from '@/services/userService'
import type { UserRequest } from '../VOs/user.types'

interface IUserCreateModalProps {
  onClose: () => void
}

/**
 * Modal para crear un nuevo usuario.
 * @param {() => void} onClose - Callback para cerrar el modal
 */
export const UserCreateModal = ({ onClose }: IUserCreateModalProps) => {
  /**
   * Estado del formulario
   */
  const [formData, setFormData] = useState<UserRequest>({
    name: '',
    email: '',
  })

  /**
   * Estado de loading y error
   */
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleChange = (field: keyof UserRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true)
      setSaveError(null)

      await userService.create(formData)
      onClose()
    } catch (err) {
      console.error('Error al crear usuario: ', err)
      setSaveError('Failed to create user')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-actions-wrapper">
          <h2>Create User</h2>
          <button className="modal-close" onClick={onClose} disabled={isSaving}>
            <FaTimes color="#fff" />
          </button>
        </div>

        {saveError && <p className="error-text">{saveError}</p>}

        <label>
          Name
          <input value={formData.name} onChange={handleChange('name')} disabled={isSaving} />
        </label>

        <label>
          Email
          <input value={formData.email} onChange={handleChange('email')} disabled={isSaving} />
        </label>

        <button onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}
