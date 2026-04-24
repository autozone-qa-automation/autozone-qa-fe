export class ServiceError extends Error {
  type: 'API_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR'
  status?: number

  constructor(
    type: 'API_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR',
    message: string,
    status?: number
  ) {
    super(message)
    this.name = 'ServiceError'
    this.type = type
    this.status = status
  }
}
