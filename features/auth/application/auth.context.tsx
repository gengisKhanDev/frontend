'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/features/auth/domain/auth.types'

interface AuthContextType {
	user: Omit<User, 'password'> | null
	token: string | null
	isLoading: boolean
	login: (token: string, user: Omit<User, 'password'>) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
	const [token, setToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const storedToken = localStorage.getItem('auth_token')
		const storedUser = localStorage.getItem('auth_user')

		if (storedToken && storedUser) {
			try {
				const userData = JSON.parse(storedUser)
				setToken(storedToken)
				setUser(userData)
			} catch (error) {
				console.error('[loan-service-front] Error parsing stored user:', error)
				localStorage.removeItem('auth_token')
				localStorage.removeItem('auth_user')
			}
		}

		setIsLoading(false)
	}, [])

	const login = (newToken: string, userData: Omit<User, 'password'>) => {
		localStorage.setItem('auth_token', newToken)
		localStorage.setItem('auth_user', JSON.stringify(userData))
		setToken(newToken)
		setUser(userData)
	}

	const logout = () => {
		localStorage.removeItem('auth_token')
		localStorage.removeItem('auth_user')
		setToken(null)
		setUser(null)
		router.push('/login')
	}

	return (
		<AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
