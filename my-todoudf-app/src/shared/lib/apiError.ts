import { AxiosError } from 'axios'

interface ApiErrorPayload {
  message?: string
  code?: string
  details?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string | undefined
  readonly details: Record<string, string[]> | undefined

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
  }

  get isUnauthorized() { return this.status === 401 }
  get isForbidden() { return this.status === 403 }
  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
  get isValidation() { return this.status === 422 }
  get isServerError() { return this.status >= 500 }

  static fromAxiosError(err: AxiosError): ApiError {
    const payload = err.response?.data as ApiErrorPayload | undefined
    return new ApiError(
      payload?.message ?? err.message ?? 'An unexpected error occurred.',
      err.response?.status ?? 0,
      payload?.code,
      payload?.details,
    )
  }

  static unknown(message = 'Something went wrong. Please try again.'): ApiError {
    return new ApiError(message, 0)
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
