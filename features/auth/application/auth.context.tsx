'use client'

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react'
import { User } from '@/features/auth/domain/auth.types'
import {
	login as loginService,
	validateToken,
	getUserFromToken,
} from '@/features/auth/infrastructure/auth.service'

interface AuthContextValue {
	user: Omit<User, 'password'> | null
	token: string | null
	isLoading: boolean
	login: (email: string, password: string) => Promise<Omit<User, 'password'>>
	logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'loan-app-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Cargar sesión desde localStorage
	useEffect(() => {
		if (typeof window === 'undefined') return

		const stored = window.localStorage.getItem(STORAGE_KEY)
		if (stored) {
			const parsed = JSON.parse(stored) as { token: string }

			if (validateToken(parsed.token)) {
				const u = getUserFromToken(parsed.token)
				if (u) {
					setUser(u)
					setToken(parsed.token)
				}
			} else {
				window.localStorage.removeItem(STORAGE_KEY)
			}
		}

		setIsLoading(false)
	}, [])

	const handleLogin = async (email: string, password: string) => {
		const res = await loginService(email, password)
		setUser(res.user)
		setToken(res.token)

		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ token: res.token }),
		)

		// devolvemos el user para que el componente pueda usar el role
		return res.user
	}

	const handleLogout = () => {
		setUser(null)
		setToken(null)
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY)
		}
	}

	const value: AuthContextValue = {
		user,
		token,
		isLoading,
		login: handleLogin,
		logout: handleLogout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
