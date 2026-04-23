/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

export interface Url {
  id: number
  environment: string
  url: string
}

export interface Service {
  id: number
  name: string
  description: string
  urls: Url[]
}
