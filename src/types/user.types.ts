/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/**
 * Interface describing a
 * Role as a data structure
 */
export interface Role {
  idRole: number
  permisionlevel: string
}

/**
 * Interface describing
 * the response for a role
 */
export interface RoleResponse {
  id: number
  permission: 'ADMIN' | 'DEV' | 'READ_ONLY'
}

/**
 * Interface describing a
 * User as a data structure
 */
export interface User {
  id: number
  name: string
  lastName: string
  email: string
  password?: string
  isActive: boolean
  roleId: number
  rolePermission?: RoleResponse
}

/**
 * UserRequest interface
 * used by the service
 */
export interface UserRequest {
  name: string
  lastName: string
  email: string
  password: string
  roleId: number
  isActive?: boolean
}

/**
 * UserUpdateRequest interface
 * used by the service
 */
export interface UserUpdateRequest {
  name?: string
  lastName?: string
  email?: string
  password?: string
  roleId?: number
  isActive?: boolean
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
