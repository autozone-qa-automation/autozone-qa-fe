/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosInstance from '../lib/axios'

/**
 * Servicio de API para manejar peticiones HTTP
 * Proporciona métodos para realizar operaciones CRUD (GET, POST, PUT, DELETE)
 * contra un servidor backend usando Axios como cliente HTTP.
 * @class ApiService
 */
class ApiService {
  /**
   * Realiza una petición GET
   *
   * @template T - Tipo genérico para el tipo de dato de la respuesta
   * @param {string} url - URL del endpoint a solicitar
   * @param {AxiosRequestConfig} [config] - Configuración opcional de Axios (headers, params, etc.)
   * @returns {Promise<T>} Promesa que se resuelve con los datos de la respuesta tipados
   *
   * @example
   * const user = await apiService.get<User>('/api/users/1')
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config)
    return response.data
  }

  /**
   * Realiza una petición POST
   *
   * @template T - Tipo genérico para el tipo de dato de la respuesta
   * @param {string} url - URL del endpoint destino
   * @param {unknown} [data] - Datos a enviar en el cuerpo de la petición
   * @param {AxiosRequestConfig} [config] - Configuración opcional de Axios (headers, params, etc.)
   * @returns {Promise<T>} Promesa que se resuelve con los datos de la respuesta tipados
   *
   * @example
   * const newUser = await apiService.post<User>('/api/users', { name: 'John', email: 'john@example.com' })
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, config)
    return response.data
  }

  /**
   * Realiza una petición PUT
   *
   * @template T - Tipo genérico para el tipo de dato de la respuesta
   * @param {string} url - URL del endpoint a actualizar
   * @param {unknown} [data] - Datos actualizados a enviar en el cuerpo de la petición
   * @param {AxiosRequestConfig} [config] - Configuración opcional de Axios (headers, params, etc.)
   * @returns {Promise<T>} Promesa que se resuelve con los datos de la respuesta tipados
   *
   * @example
   * const updatedUser = await apiService.put<User>('/api/users/1', { name: 'Jane' })
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config)
    return response.data
  }

  /**
   * Realiza una petición DELETE
   *
   * @template T - Tipo genérico para el tipo de dato de la respuesta
   * @param {string} url - URL del endpoint a eliminar
   * @param {AxiosRequestConfig} [config] - Configuración opcional de Axios (headers, params, etc.)
   * @returns {Promise<T>} Promesa que se resuelve con los datos de la respuesta tipados
   *
   * @example
   * const result = await apiService.delete<{ success: boolean }>('/api/users/1')
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config)
    return response.data
  }
}

export const apiService = new ApiService()
