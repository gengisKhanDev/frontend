export type UserRole = 'user' | 'admin'

export interface User {
	id: string
	email: string
	role: UserRole
	name: string
}

export interface AuthResponse {
	user: Omit<User, 'password'>
	token: string
}

export interface LoginCredentials {
	email: string
	password: string
}
