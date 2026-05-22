// ─── Domain model — describes a person, NOT auth artifacts ───────────────────
export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  name: string // computed: "First [Middle] Last"
  dateOfBirth: string
  maritalStatus: string
  religion: string
}

// ─── Auth API types — kept separate from the User model ──────────────────────
export interface LoginResponse {
  user: User
  accessToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// confirmPassword is NOT here — it is a UI-only validation concern.
// useRegister strips it before calling authApi.register().
export interface RegisterCredentials {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  maritalStatus: string
  religion: string
}
