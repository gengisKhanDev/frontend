import { Loan } from '@/features/loans/domain/loan.types'
import { StatusBadge } from '@/components/atoms/status-badge'

interface LoanItemProps {
	loan: Loan
}

export function LoanItem({ loan }: LoanItemProps) {
	return (
		<div className="flex items-center justify-between py-2 text-sm">
			<span className="text-foreground">
				Monto: ${loan.amount.toLocaleString('es-MX')}
			</span>
			<span className="text-muted-foreground">-</span>
			<div className="flex items-center gap-2">
				<span className="text-muted-foreground">Estado:</span>
				<StatusBadge status={loan.status} />
			</div>
		</div>
	)
}
