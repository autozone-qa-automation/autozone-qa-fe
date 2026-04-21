/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/**
 * Interfaz para un request
 * response error generico
 */

export interface ErrorResponse {
  status: number
  message: string
  timeStamp: string
}
