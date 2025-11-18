'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/organisms/page-header'
import { LoanRequestForm } from '@/components/organisms/loan-request-form'
import { LoanList } from '@/components/organisms/loan-list'
import { LoanListSkeleton } from '@/components/organisms/loan-list-skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/application/auth.context'
import { getLoansByUserId } from '@/features/loans/infrastructure/loan.service'
import { Loan } from '@/features/loans/domain/loan.types'
import { Loader2 } from 'lucide-react'

export default function PrestamosPage() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useAuth()
	const [loans, setLoans] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login')
		}
	}, [user, authLoading, router])

	const loadLoans = async () => {
		if (!user) return

		setIsLoading(true)
		try {
			const data = await getLoansByUserId(user.id)
			setLoans(data)
		} catch (error) {
			console.error('[loan-service-front] Error loading loans:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!authLoading && user) {
			loadLoans()
		}
	}, [user, authLoading])

	if (authLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className="min-h-screen bg-background">
			<PageHeader />

			<main className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Solicitar Préstamo</CardTitle>
							<CardDescription>
								Ingrese el monto que desea solicitar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<LoanRequestForm onSuccess={loadLoans} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Mis Préstamos</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<LoanListSkeleton />
							) : (
								<LoanList loans={loans} />
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
