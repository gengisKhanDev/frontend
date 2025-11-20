'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormField } from '@/components/molecules/form-field'
import { useAuth } from '@/features/auth/application/auth.context'
import { validateEmail, validatePassword } from '@/features/auth/domain/auth.validation'
import { AlertCircle, Loader2 } from 'lucide-react'

export function LoginForm() {
	const router = useRouter()
	const { login } = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})

	const [errors, setErrors] = useState({
		email: '',
		password: ''
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		const emailValidation = validateEmail(formData.email)
		const passwordValidation = validatePassword(formData.password)

		if (!emailValidation.isValid || !passwordValidation.isValid) {
			setErrors({
				email: emailValidation.error || '',
				password: passwordValidation.error || ''
			})
			return
		}

		setIsLoading(true)

		try {
			// usamos SOLO el contexto
			const user = await login(formData.email, formData.password)

			if (user.role === 'admin') {
				router.push('/admin/dashboard')
			} else {
				router.push('/prestamos')
			}

			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({ ...prev, [field]: e.target.value }))
		setErrors(prev => ({ ...prev, [field]: '' }))
	}

	return (
		<Card className="w-full max-w-md border-border/50 shadow-xl">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
				<CardDescription>
					Ingresa tus credenciales para acceder al sistema
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="Email"
						id="email"
						type="email"
						placeholder="usuario@test.com"
						value={formData.email}
						onChange={handleChange('email')}
						disabled={isLoading}
						error={errors.email}
					/>

					<FormField
						label="Contraseña"
						id="password"
						type="password"
						placeholder="••••••"
						value={formData.password}
						onChange={handleChange('password')}
						disabled={isLoading}
						error={errors.password}
					/>

					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Iniciando sesión...
							</>
						) : (
							'Iniciar Sesión'
						)}
					</Button>
				</form>

				<div className="mt-6 pt-4 border-t border-border/50">
					<p className="text-sm text-muted-foreground text-center">
						Credenciales de prueba:
					</p>
					<div className="mt-2 space-y-1 text-xs text-muted-foreground">
						<p>Usuario: usuario@test.com / 123</p>
						<p>Admin: admin@test.com / 123</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
