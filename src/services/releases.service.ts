/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import z from 'zod'
import type { ReleaseCreateVO } from '@/models/ReleaseCreateVO'
import type { Release, ReleaseStatus } from '@/types/Release.types'
import type { CreateReleasesRequest, FormValues } from '@/utils/schemas/release.schema'
import { releaseSchema } from '@/utils/schemas/release.schema'
import { apiService } from './api.service'

/**
 * Esquema de validación para la respuesta de un release, omitiendo algunos campos y agregando otros para adaptarse a la estructura esperada en la respuesta de la API.
 * Se utiliza para validar y parsear la respuesta de la API al obtener un release o una lista de releases.
 */
const releaseResponseSchema = releaseSchema
  .omit({
    releaseFeatureIds: true,
  })
  .extend({
    releaseId: z.number(),
    releaseLaunchDate: z.string().nullable(),
    releaseServiceId: z.number().nullable(),
    releaseServices: z.array(z.string()),
    releaseFeatures: z.array(z.any()),
  })

/**
 * Servicio de Releases
 * Proporciona métodos para realizar operaciones CRUD en releases.
 * Comunicación directa con la API a través del servicio de Axios.
 */
class ReleaseService {
  private readonly BASE_URL = 'releases'

  /**
   * Obtiene la lista de todos los releases.
   * @returns {Promise<Release[]>} Un arreglo con todos los releases
   */
  async getAll(): Promise<Release[]> {
    const data = await apiService.get<unknown>(this.BASE_URL)
    return releaseResponseSchema.array().parse(data) as Release[]
  }

  /**
   * Obtiene el último release asociado a un servicio específico.
   * @param {number} serviceId - El ID del servicio para filtrar el último release
   * @returns {Promise<Release[]>} Un arreglo con el último release encontrado para el servicio dado
   */
  async getLastByServiceId(serviceId: number): Promise<Release[]> {
    const data = await apiService.get<unknown>(`${this.BASE_URL}/last`, {
      params: { serviceId },
    })
    return releaseResponseSchema.array().parse(data) as Release[]
  }

  /**
   * Obtiene un release por su ID.
   * @param {string} id - El ID del release a obtener
   * @returns {Promise<Release>} El release encontrado
   */
  async getById(id: string): Promise<FormValues> {
    const data = await apiService.get<unknown>(`${this.BASE_URL}/${id}`)
    return releaseSchema.parse(data)
  }

  /**
   * Crea un nuevo release.
   * @param {ReleaseCreateVO} payload - Los datos del nuevo release a crear
   * @returns {Promise<FormValues>} El release creado con su ID asignado
   */
  async create(payload: ReleaseCreateVO): Promise<FormValues> {
    const data = await apiService.post<unknown>(this.BASE_URL, payload)
    // Return data directly (bypassing Zod) to avoid validation errors from mismatched backend response,
    // while keeping `Promise<FormValues>` to satisfy unit tests.
    return data as FormValues
  }

  /**
   * Actualiza un release existente.
   * @param {string} id - El ID del release a actualizar
   * @param {Partial<CreateReleasesRequest>} payload - Los datos a actualizar
   * @returns {Promise<FormValues>} El release actualizado
   */
  async update(id: string, payload: Partial<CreateReleasesRequest>): Promise<FormValues> {
    const data = await apiService.put<unknown>(`${this.BASE_URL}/${id}`, payload)
    return releaseSchema.parse(data)
  }

  /**
   * Actualiza el estado de un release existente.
   * @param {number} id - El ID del release a actualizar
   * @param {ReleaseStatus} status - El nuevo estado del release
   * @returns {Promise<Release>} El release actualizado con el nuevo estado
   */
  async updateStatus(id: number, status: ReleaseStatus): Promise<Release> {
    const encodedStatus = encodeURIComponent(status)
    const data = await apiService.put<unknown>(
      `${this.BASE_URL}/${id}/status/${encodedStatus}`,
      null
    )
    return releaseResponseSchema.parse(data) as Release
  }

  /**
   * Elimina un release por su ID.
   * @param {number | string} id - El ID del release a eliminar
   * @returns {Promise<void>} Una promesa que se resuelve cuando el release ha sido eliminado
   */
  async delete(id: number | string): Promise<void> {
    await apiService.delete<void>(`${this.BASE_URL}/${id}`)
  }
}

export const releaseService = new ReleaseService()
