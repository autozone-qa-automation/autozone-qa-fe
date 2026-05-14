/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { User } from '../types/user.types'

/**
 * Value Object (VO) for representing an authenticated user.
 * Transforms raw User API data into a strongly-typed, immutable object with display helpers.
 *
 * @class UserVO
 */
export class UserVO {
  readonly id: number
  readonly name: string
  readonly lastName: string
  readonly email: string
  readonly isActive: boolean
  readonly roleId: number
  readonly rolePermission?: string

  /**
   * Creates a UserVO instance from raw User API response data.
   * @param data - Raw User object from API/authentication response
   */
  constructor(data: User) {
    this.id = data.id
    this.name = data.name
    this.lastName = data.lastName
    this.email = data.email
    this.isActive = data.isActive
    this.roleId = data.roleId
    this.rolePermission = data.rolePermission?.permission
  }

  /**
   * Returns formatted full name for display.
   * @returns Combined first and last name (e.g., 'John Doe')
   */
  getFullName(): string {
    return `${this.name} ${this.lastName}`
  }

  /**
   * Returns email address for display purposes.
   * @returns User email address
   */
  getDisplayEmail(): string {
    return this.email
  }
}
