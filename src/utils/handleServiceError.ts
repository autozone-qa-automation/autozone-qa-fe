/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import axios from 'axios'
import { ZodError } from 'zod'
import { ServiceError } from '@/models/errors/ServiceError'

/**
 * Defines the expected shape of an error payload returned by our API.
 * @interface ApiErrorResponse
 * @property {string} [message] - Optional error message provided by the server.
 */
interface ApiErrorResponse {
  message?: string
}

/**
 * A centralized error handler that catches unknown errors and normalizes them into a standard `ServiceError`.
 * * This function evaluates the error type (Zod validation, Axios network request, or generic)
 * and extracts the most relevant message and status code before throwing the formatted error.
 * * @param {unknown} error - The caught error object. Typed as `unknown` because catch blocks in TypeScript do not know the error type by default.
 * @throws {ServiceError} Always throws a standardized ServiceError.
 * @returns {never} - Returns `never` because the function always interrupts execution by throwing an error.
 */
export const handleServiceError = (error: unknown): never => {
  // Type Guard: Checks if the error was caused by Zod schema validation failing
  if (error instanceof ZodError) {
    throw new ServiceError('VALIDATION_ERROR', 'Data validation failed')
  }

  // Type Guard: Checks if the error is an Axios HTTP error, applying the ApiErrorResponse interface to the response data
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status
    const apiMessage = error.response?.data?.message
    const message: string = apiMessage || error.message || 'Server error'

    throw new ServiceError('API_ERROR', message, status)
  }

  // Fallback: Handles standard JavaScript Error objects or completely unknown error types
  const defaultMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
  throw new ServiceError('UNKNOWN_ERROR', defaultMessage)
}
