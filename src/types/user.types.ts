/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

export interface Role {
  idRole: number
  permisionlevel: string
}

export interface RoleResponse {
  id: number
  permission: 'ADMIN' | 'DEV' | 'READ_ONLY'
}

export interface User {
  id: number
  name: string
  lastname: string
  email: string
  password?: string
  idRole: number
  role?: Role
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

export interface UserRequest {
  name: string
  lastName: string
  email: string
  password: string
  roleId: number
  isActive?: boolean
}

export interface UserUpdateRequest {
  name?: string
  lastname?: string
  email?: string
  password?: string
  idRole?: number
}
