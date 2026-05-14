/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/**
 * Interfaz describiendo un
 * Role como estructura de datos
 */
export interface Role {
  idRole: number
  permission: string
}

/**
 * Interfaz describiendo un
 * User como estructura de datos
 */
export interface User {
  id: number
  name: string
  lastName: string
  email: string
  password?: string
  isActive: boolean
  roleId: number
  rolePermission?: Role
}

/**
 * Interfaz del userRequest
 * usado por el servicio
 */
export interface UserRequest {
  name: string
  lastname: string
  email: string
  password: string
  idRole: number
}

/**
 * Interfaz del userRequest
 * especifico para metodo PUT
 */
export interface UserUpdateRequest {
  name?: string
  lastname?: string
  email?: string
  password?: string
  idRole?: number
}
