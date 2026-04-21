/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { User, UserRequest, UserUpdateRequest } from '../types/user.types'
import { apiService } from './api.service'

/**
 * Servicio de Usuarios
 * Proporciona métodos para realizar operaciones CRUD en usuarios.
 * Comunicación directa con la API a través del servicio de Axios.
 */
class UserService {
  private readonly BASE_PATH = '/v1/users'

  /**
   * Obtiene la lista de todos los usuarios.
   * @returns {Promise<User[]>} Un arreglo con todos los usuarios
   */
  async getAll(): Promise<User[]> {
    return apiService.get<User[]>(this.BASE_PATH)
  }

  /**
   * Obtiene un usuario por su ID.
   * @param {number} id - El ID del usuario a obtener
   * @returns {Promise<User>} El usuario encontrado
   */
  async getById(id: number): Promise<User> {
    return apiService.get<User>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Crea un nuevo usuario.
   * @param {UserRequest} data - Los datos del nuevo usuario
   * @returns {Promise<User>} El usuario creado con su ID asignado
   */
  async create(data: UserRequest): Promise<User> {
    return apiService.post<User>(this.BASE_PATH, data)
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
}

export const userService = new UserService()
