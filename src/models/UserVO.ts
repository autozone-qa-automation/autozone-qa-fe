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
  readonly lastname: string
  readonly email: string
  readonly idRole: number
  readonly roleName?: string

  /**
   * Creates a UserVO instance from raw User API response data.
   * @param data - Raw User object from API/authentication response
   */
  constructor(data: User) {
    this.id = data.id
    this.name = data.name
    this.lastname = data.lastname
    this.email = data.email
    this.idRole = data.idRole
    this.roleName = data.role?.permisionlevel
  }

  /**
   * Returns formatted full name for display.
   * @returns Combined first and last name (e.g., 'John Doe')
   */
  getFullName(): string {
    return `${this.name} ${this.lastname}`
  }

  /**
   * Returns email address for display purposes.
   * @returns User email address
   */
  getDisplayEmail(): string {
    return this.email
  }
}
