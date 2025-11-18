import usersData from '@/features/auth/infrastructure/mocks/users.json'
import { User, AuthResponse } from '@/features/auth/domain/auth.types'

function generateMockToken(userId: string, role: string): string {
	const payload = btoa(JSON.stringify({ userId, role, exp: Date.now() + 3600000 }))
	return `mock.${payload}.signature`
}

export function decodeToken(token: string): { userId: string; role: string; exp: number } | null {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) return null
		return JSON.parse(atob(parts[1]))
	} catch {
		return null
	}
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	await new Promise(resolve => setTimeout(resolve, 800))

	const user = usersData.find(u => u.email === email && u.password === password) as User | undefined

	if (!user) {
		throw new Error('Credenciales inválidas')
	}

	const { password: _, ...userWithoutPassword } = user
	const token = generateMockToken(user.id, user.role)

	return {
		user: userWithoutPassword,
		token
	}
}

export function validateToken(token: string): boolean {
	const decoded = decodeToken(token)
	if (!decoded) return false
	return decoded.exp > Date.now()
}

export function getUserFromToken(token: string): Omit<User, 'password'> | null {
	const decoded = decodeToken(token)
	if (!decoded || !validateToken(token)) return null

	const user = usersData.find(u => u.id === decoded.userId) as User | undefined
	if (!user) return null

	const { password: _, ...userWithoutPassword } = user
	return userWithoutPassword
}
