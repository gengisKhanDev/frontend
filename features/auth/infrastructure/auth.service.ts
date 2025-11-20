'use client'

import { User, AuthResponse } from '@/features/auth/domain/auth.types'

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

/**
 * Construye el "token" que vamos a guardar:
 * es simplemente el Base64 de "email:password"
 */
function buildBasicToken(email: string, password: string): string {
	return btoa(`${email}:${password}`)
}

/**
 * Este header se usará en todos los fetch al backend protegido con Basic Auth
 */
export function buildAuthHeader(token: string | null): HeadersInit {
	if (!token) return {}
	return {
		Authorization: `Basic ${token}`,
	}
}

/**
 * Como el backend solo usa Basic Auth y no tiene un /login como tal,
 * nosotros "validamos" haciendo un request real al backend.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
	const basicToken = buildBasicToken(email, password)

	const res = await fetch(`${API_BASE_URL}/api/loans`, {
		method: 'GET',
		headers: {
			...buildAuthHeader(basicToken),
			Accept: 'application/json',
		},
	})

	if (res.status === 401) {
		throw new Error('Credenciales inválidas')
	}

	if (!res.ok) {
		throw new Error('Error al intentar iniciar sesión')
	}

	// Como la prueba solo tiene estos dos usuarios, podemos mapearlos aquí
	const isAdmin = email === 'admin@test.com'

	const user: Omit<User, 'password'> = {
		id: isAdmin ? '2' : '1',
		email,
		role: isAdmin ? 'admin' : 'user',
		name: isAdmin ? 'Administrador' : 'Usuario',
	}

	return {
		user,
		token: basicToken, // guardamos solo el Base64, sin "Basic "
	}
}

/**
 * En Basic Auth realmente no hay expiración, pero mantenemos la interfaz.
 */
export function validateToken(token: string | null): boolean {
	return !!token
}

/**
 * Reconstruimos el usuario a partir del token guardado.
 * Solo usamos el email y de nuevo mappeamos a admin/user.
 */
export function getUserFromToken(token: string | null): Omit<User, 'password'> | null {
	if (!token) return null

	try {
		const decoded = atob(token) // "email:password"
		const [email] = decoded.split(':')

		if (!email) return null

		const isAdmin = email === 'admin@test.com'

		const user: Omit<User, 'password'> =
			isAdmin
				? {
					id: '2',
					email,
					role: 'admin',
					name: 'Administrador',
				}
				: {
					id: '1',
					email,
					role: 'user',
					name: 'Usuario',
				}

		return user
	} catch {
		return null
	}
}
