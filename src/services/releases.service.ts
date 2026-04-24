/**
 * @file releases.service.ts
 * @description Lógica de comunicación con el API para la entidad Release.
 */

import { apiService } from '@/services/apiService'
import type { Release } from '@/types/Release.types'

/**
 * Clase que encapsula las llamadas a la API para Releases.
 * Utiliza un prefijo de ruta común para todas las peticiones.
 */
class ReleaseService {
  private readonly BASE_PATH = '/releases'

  /**
   * Obtiene todos los releases desde el endpoint configurado.
   * @returns {Promise<Release[]>} Promesa que resuelve a una lista de releases.
   */
  getAll = async (): Promise<Release[]> => {
    return apiService.get<Release[]>(this.BASE_PATH)
  }

  /**
   * Busca un release específico por su identificador.
   * @param {number} id - Identificador único del release.
   * @returns {Promise<Release>} Promesa con los datos del release.
   */
  getById = async (id: number): Promise<Release> => {
    return apiService.get<Release>(`${this.BASE_PATH}/${id}`)
  }
}

export const releaseService = new ReleaseService()
