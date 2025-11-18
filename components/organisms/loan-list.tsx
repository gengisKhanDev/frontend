import { Loan } from '@/features/loans/domain/loan.types'
import { LoanItem } from '@/components/molecules/loan-item'

interface LoanListProps {
	loans: Loan[]
}

export function LoanList({ loans }: LoanListProps) {
	if (loans.length === 0) {
		return (
			<p className="text-sm text-muted-foreground text-center py-4">
				No tienes préstamos solicitados
			</p>
		)
	}

	return (
		<div className="space-y-1">
			{loans.map((loan) => (
				<LoanItem key={loan.id} loan={loan} />
			))}
		</div>
	)
}
