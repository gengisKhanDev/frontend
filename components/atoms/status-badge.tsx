import { Badge } from '@/components/ui/badge'
import { LoanStatus } from '@/features/loans/domain/loan.types'
import { LOAN_STATUS_CONFIG } from '@/features/loans/domain/loan.constants'

interface StatusBadgeProps {
	status: LoanStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
	const config = LOAN_STATUS_CONFIG[status]

	return (
		<Badge variant={config.variant}>
			{config.label}
		</Badge>
	)
}
