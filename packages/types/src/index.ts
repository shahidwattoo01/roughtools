// Shared platform type definitions

export type Maybe<T> = T | null | undefined

export type ID = string

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}
