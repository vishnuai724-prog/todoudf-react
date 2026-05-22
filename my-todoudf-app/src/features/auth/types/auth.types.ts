// ─── User & Auth types ────────────────────────────────────────────────────────

export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  name: string // Full name computed from first, middle, last
  dateOfBirth: string
  maritalStatus: string
  religion: string
  token?: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  maritalStatus: string
  religion: string
}
