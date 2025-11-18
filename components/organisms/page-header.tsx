import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/application/auth.context'
import { useRouter } from 'next/navigation'

export function PageHeader() {
	const { user, logout } = useAuth()
	const router = useRouter()

	const handleLogout = () => {
		logout()
		router.push('/login')
	}

	return (
		<header className="border-b border-border bg-card/50 backdrop-blur">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold">
					Bienvenido, {user?.name}
				</h1>
				<Button onClick={handleLogout} variant="outline">
					Cerrar Sesión
				</Button>
			</div>
		</header>
	)
}
