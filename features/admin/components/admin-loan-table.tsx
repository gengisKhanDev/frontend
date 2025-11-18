'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Loan, LoanStatus } from '@/features/loans/domain/loan.types'
import { updateLoanStatus } from '@/features/loans/infrastructure/loan.service'
import { useAuth } from '@/features/auth/application/auth.context'
import { LOAN_STATUS_CONFIG } from '@/features/loans/domain/loan.constants'
import { Check, X, Loader2 } from 'lucide-react'

interface AdminLoanTableProps {
	loans: Loan[]
	onUpdate: () => void
}

export function AdminLoanTable({ loans, onUpdate }: AdminLoanTableProps) {
	const { user } = useAuth()
	const [loadingId, setLoadingId] = useState<string | null>(null)

	const handleStatusChange = async (loanId: string, status: LoanStatus) => {
		if (!user) return

		setLoadingId(loanId)
		try {
			await updateLoanStatus(loanId, status, user.name)
			onUpdate()
		} catch (error) {
			console.error('[loan-service-front] Error updating loan:', error)
		} finally {
			setLoadingId(null)
		}
	}

	return (
		<div className="rounded-lg border border-border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Usuario</TableHead>
						<TableHead>Monto</TableHead>
						<TableHead>Plazo</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Fecha</TableHead>
						<TableHead className="text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loans.map((loan) => {
						const statusConfig = LOAN_STATUS_CONFIG[loan.status]
						const isLoading = loadingId === loan.id

						return (
							<TableRow key={loan.id}>
								<TableCell className="font-mono text-sm">#{loan.id}</TableCell>
								<TableCell>
									<div>
										<p className="font-medium">{loan.userName}</p>
										<p className="text-xs text-muted-foreground">{loan.userEmail}</p>
									</div>
								</TableCell>
								<TableCell className="font-semibold">
									${loan.amount.toLocaleString('es-MX')}
								</TableCell>
								<TableCell>{loan.term} meses</TableCell>
								<TableCell>
									<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
								</TableCell>
								<TableCell className="text-sm">
									{new Date(loan.requestDate).toLocaleDateString('es-MX')}
								</TableCell>
								<TableCell className="text-right">
									{loan.status === 'pending' ? (
										<div className="flex gap-2 justify-end">
											<Button
												size="sm"
												variant="default"
												onClick={() => handleStatusChange(loan.id, 'approved')}
												disabled={isLoading}
											>
												{isLoading ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<>
														<Check className="h-4 w-4 mr-1" />
														Aprobar
													</>
												)}
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() => handleStatusChange(loan.id, 'rejected')}
												disabled={isLoading}
											>
												{isLoading ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<>
														<X className="h-4 w-4 mr-1" />
														Rechazar
													</>
												)}
											</Button>
										</div>
									) : (
										<span className="text-sm text-muted-foreground">
											{loan.reviewDate && `Revisado ${new Date(loan.reviewDate).toLocaleDateString('es-MX')}`}
										</span>
									)}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
