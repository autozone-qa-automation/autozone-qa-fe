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

export interface RoleResponse {
  id: number
  permission: 'ADMIN' | 'DEV' | 'READ_ONLY'
}

/**
 * Interfaz del userRequest
 * usado por el servicio
 */
export interface UserRequest {
  name: string
  lastName: string
  email: string
  password: string
  roleId: number
  isActive: boolean
}

export interface UserResponse {
  id: number
  name: string
  lastName: string
  email: string
  password: string
  isActive: boolean
  roleId: number
  rolePermission: RoleResponse
}

/**
 * Interfaz del userRequest
 * especifico para metodo PUT
 */
export interface UserUpdateRequest {
  name?: string
  lastName?: string
  email?: string
  password?: string
  roleId?: number
}
