/**
 * @file releases.service.ts
 * @description Lógica de comunicación con el API de Spring Boot.
 */

import { apiService } from '@/services/api.service'
import type { Release } from '@/types/Release.types'

class ReleaseService {
  // IMPORTANTE: Verifica si tu server corre en http://localhost:8080
  // Si apiService no tiene la base URL, cámbiala aquí a la ruta completa
  private readonly BASE_PATH = '/releases'

  /**
   * Obtiene los releases del backend de Java.
   */
  getAll = async (): Promise<Release[]> => {
    return apiService.get<Release[]>(this.BASE_PATH)
  }

  /**
   * Obtiene un release por ID.
   */
  getById = async (id: number): Promise<Release> => {
    return apiService.get<Release>(`${this.BASE_PATH}/${id}`)
  }
}

export const releaseService = new ReleaseService()
