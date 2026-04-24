/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/**
 * Interfaz que describe un Feature
 * tal cual viene del Backend (GET)
 */
export interface Feature {
  idFeature: number
  featureDescription: string
  FeatureName: string
  idService: number
}

/**
 * Interfaz para crear un Feature (POST)
 * Basado en el payload que nos funcionó
 */
export interface FeatureCreateRequest {
  featureName: string
  featureDescription: string
  idService: number
}
