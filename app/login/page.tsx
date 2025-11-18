'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/application/auth.context'
import { LoginForm } from '@/features/auth/components/login-form'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
	const router = useRouter()
	const { user, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && user) {
			if (user.role === 'admin') {
				router.push('/admin/dashboard')
			} else {
				router.push('/prestamos')
			}
		}
	}, [user, isLoading, router])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (user) {
		return null
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
						<span className="text-primary-foreground font-bold text-2xl">MB</span>
					</div>
					<h1 className="text-3xl font-bold mb-2">Makers Bank</h1>
					<p className="text-muted-foreground">Sistema de Gestión de Préstamos</p>
				</div>
				<LoginForm />
			</div>
		</div>
	)
}
