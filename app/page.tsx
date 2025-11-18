'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/application/auth.context'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
	const router = useRouter()
	const { user, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading) {
			if (!user) {
				router.push('/login')
			} else if (user.role === 'admin') {
				router.push('/admin/dashboard')
			} else {
				router.push('/prestamos')
			}
		}
	}, [user, isLoading, router])

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	)
}
