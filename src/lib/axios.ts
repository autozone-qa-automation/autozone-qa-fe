/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { ErrorResponse } from '@/types/Error.types'

/**
 * URLs de la API por entorno
 */
const ENV_URLS: Record<string, string> = {
  dev: import.meta.env.VITE_API_URL_DEV,
  uat: import.meta.env.VITE_API_URL_UAT,
  local: import.meta.env.VITE_API_URL_LOCAL,
}

/**
 * Obtiene la URL base según el entorno actual
 * @returns {string} La URL base para el entorno configurado
 */
const getBaseUrl = (): string => {
  const env = import.meta.env['VITE_ENV'] ?? 'local'
  const url = ENV_URLS[env]

  if (!url) {
    console.error('Missing API URL for env:', env)
    return ''
  }

  return url
}

/**
 * Instancia configurada de Axios
 * Incluye configuración base, headers y timeout
 */
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

/**
 * Interceptor de solicitudes
 * Permite modificar la configuración antes de enviar la solicitud
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/**
 * Interceptor de respuestas
 * Maneja las respuestas exitosas
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
)

/**
 * Interceptor de respuestas para manejo de errores
 * Transforma errores del backend en errores más legibles
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    const backendError = error.response?.data
    if (backendError?.message) {
      return Promise.reject(new Error(backendError.message))
    }
    return Promise.reject(new Error(error.message))
  }
)

export default axiosInstance
