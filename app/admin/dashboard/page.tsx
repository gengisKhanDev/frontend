'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/application/auth.context'
import { PageHeader } from '@/components/organisms/page-header'
import { AdminLoanTable } from '@/features/admin/components/admin-loan-table'
import { getAllLoans } from '@/features/loans/infrastructure/loan.service'
import { Loan } from '@/features/loans/domain/loan.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileCheck, FileClock, FileX, FileText, Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useAuth()
	const [loans, setLoans] = useState<Loan[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!authLoading) {
			if (!user) {
				router.push('/login')
			} else if (user.role !== 'admin') {
				router.push('/prestamos')
			}
		}
	}, [user, authLoading, router])

	const loadLoans = async () => {
		setIsLoading(true)
		try {
			const data = await getAllLoans()
			setLoans(data)
		} catch (error) {
			console.error('[loan-service-front] Error loading loans:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!authLoading && user && user.role === 'admin') {
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

	if (!user || user.role !== 'admin') {
		return null
	}

	const stats = {
		total: loans.length,
		pending: loans.filter(l => l.status === 'pending').length,
		approved: loans.filter(l => l.status === 'approved').length,
		rejected: loans.filter(l => l.status === 'rejected').length
	}

	return (
		<div className="min-h-screen bg-background">
			<PageHeader />

			<main className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h2 className="text-3xl font-bold mb-2">Panel de Administración</h2>
					<p className="text-muted-foreground">
						Gestiona y revisa las solicitudes de préstamo
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-4 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<div className="text-2xl font-bold">{stats.total}</div>
							)}
							<p className="text-xs text-muted-foreground">
								Solicitudes totales
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Pendientes</CardTitle>
							<FileClock className="h-4 w-4 text-warning" />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<div className="text-2xl font-bold text-warning">{stats.pending}</div>
							)}
							<p className="text-xs text-muted-foreground">
								Por revisar
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Aprobados</CardTitle>
							<FileCheck className="h-4 w-4 text-success" />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<div className="text-2xl font-bold text-success">{stats.approved}</div>
							)}
							<p className="text-xs text-muted-foreground">
								Préstamos activos
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Rechazados</CardTitle>
							<FileX className="h-4 w-4 text-destructive" />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<Skeleton className="h-8 w-16" />
							) : (
								<div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
							)}
							<p className="text-xs text-muted-foreground">
								No aprobados
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Todas las Solicitudes</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-16 w-full" />
								))}
							</div>
						) : (
							<AdminLoanTable loans={loans} onUpdate={loadLoans} />
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
