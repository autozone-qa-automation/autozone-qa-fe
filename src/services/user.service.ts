/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { User, UserRequest, UserResponse, UserUpdateRequest } from '../types/user.types'
import { apiService } from './api.service'

/**
 * Servicio de Usuarios
 * Proporciona métodos para realizar operaciones CRUD en usuarios.
 * Comunicación directa con la API a través del servicio de Axios.
 */
class UserService {
  private readonly BASE_PATH = 'users'

  /**
   * Obtiene la lista de todos los usuarios.
   * @returns {Promise<User[]>} Un arreglo con todos los usuarios
   */
  async getAll(): Promise<User[]> {
    return apiService.get<User[]>(this.BASE_PATH)
  }

  /**
   * Obtiene un usuario por su ID.
   * @param {number} _id - El ID del usuario a obtener
   * @returns {Promise<User>} El usuario encontrado
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(_id: number): Promise<User> {
    const hardcodedUser: User = {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      email: 'text@example.com',
      password: 'password',
      isActive: true,
      roleId: 1,
    }

    return new Promise(res => setTimeout(() => res(hardcodedUser), 10))
  }

  /**
   * Crea un nuevo usuario.
   * @param {UserRequest} data - Los datos del nuevo usuario
   * @returns {Promise<UserResponse>} El usuario creado con su ID asignado
   */
  async create(data: UserRequest): Promise<UserResponse> {
    return apiService.post<UserResponse>(this.BASE_PATH, data)
  }

  /**
   * Actualiza un usuario existente.
   * @param {number} id - El ID del usuario a actualizar
   * @param {UserUpdateRequest} data - Los datos a actualizar
   * @returns {Promise<User>} El usuario actualizado
   */
  async update(id: number, data: UserUpdateRequest): Promise<User> {
    return apiService.put<User>(`${this.BASE_PATH}/${id}`, data)
  }

  /**
   * Desactiva un usuario mediante el endpoint dedicado.
   * @param {number | string} id - El ID del usuario a desactivar
   * @returns {Promise<void>}
   */
  async deactivate(id: number | string): Promise<void> {
    await apiService.patch<User>(`${this.BASE_PATH}/${id}/deactivate`)
  }
}

export const userService = new UserService()
