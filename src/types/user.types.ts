/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/**
 * Interfaz describiendo un
 * User como estructura de datos
 */

export interface User {
  id: number
  name: string
  email: string
}

/**
 * Interfaz del userRequest
 * usado por el servicio
 */
export interface UserRequest {
  name: string
  email: string
}

/**
 * Interfaz del userRequest
 * especifico para metodo PUT
 */
export interface UserUpdateRequest {
  name?: string
  email?: string
}
