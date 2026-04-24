/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { handleServiceError } from '@/utils/handleServiceError'
import type { CreateFeatureRequest, Feature } from '../types/feature.types'
import { featureSchema } from '../types/feature.types'
import { apiService } from './api.service'

const BASE_URL = '/features'

/**
 * Servicio para gestionar las operaciones CRUD de la entidad Feature a través de la API.
 */
export const featureService = {
  /**
   * Obtiene la lista completa de features.
   * * @returns {Promise<Feature[]>} Una promesa que resuelve en un arreglo de objetos Feature validados.
   * @throws {ZodError} Si la respuesta de la API no cumple con el esquema esperado (featureSchema).
   */
  getAll: async (): Promise<Feature[]> => {
    try {
      const data = await apiService.get<unknown>(BASE_URL)
      return featureSchema.array().parse(data)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },

  /**
   * Obtiene una lista filtrada de features basándose en un ID proporcionado.
   * * @param {string} id - El identificador utilizado para filtrar los resultados.
   * @returns {Promise<Feature[]>} Una promesa que resuelve en un arreglo de objetos Feature validados.
   * @throws {ZodError} Si la respuesta de la API no cumple con el esquema esperado.
   */
  getAllFiltered: async (id: string): Promise<Feature[]> => {
    try {
      const data = await apiService.get<unknown>(`${BASE_URL}/filtered/${id}`)
      return featureSchema.array().parse(data)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },

  /**
   * Obtiene un feature específico por su ID.
   * * @param {string} id - El identificador único del feature.
   * @returns {Promise<Feature>} Una promesa que resuelve en el objeto Feature solicitado y validado.
   * @throws {ZodError} Si la respuesta de la API no cumple con el esquema esperado.
   */
  getById: async (id: string): Promise<Feature> => {
    try {
      const data = await apiService.get<unknown>(`${BASE_URL}/${id}`)
      return featureSchema.parse(data)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },

  /**
   * Crea un nuevo feature.
   * * @param {CreateFeatureRequest} payload - Los datos necesarios para crear el feature.
   * @returns {Promise<Feature>} Una promesa que resuelve en el nuevo objeto Feature creado y validado.
   * @throws {ZodError} Si la respuesta de la API no cumple con el esquema esperado.
   */
  create: async (payload: CreateFeatureRequest): Promise<Feature> => {
    try {
      const data = await apiService.post<unknown>(BASE_URL, payload)
      return featureSchema.parse(data)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },

  /**
   * Actualiza un feature existente.
   * * @param {string} id - El identificador único del feature a actualizar.
   * @param {Partial<CreateFeatureRequest>} payload - Los datos a actualizar (permite actualizaciones parciales).
   * @returns {Promise<Feature>} Una promesa que resuelve en el objeto Feature actualizado y validado.
   * @throws {ZodError} Si la respuesta de la API no cumple con el esquema esperado.
   */
  update: async (id: string, payload: Partial<CreateFeatureRequest>): Promise<Feature> => {
    try {
      const data = await apiService.put<unknown>(`${BASE_URL}/${id}`, payload)
      return featureSchema.parse(data)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },

  /**
   * Elimina un feature de la base de datos por su ID.
   * * @param {string} id - El identificador único del feature a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la operación de eliminación se completa con éxito.
   */
  remove: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`${BASE_URL}/${id}`)
    } catch (error: unknown) {
      return handleServiceError(error)
    }
  },
}
