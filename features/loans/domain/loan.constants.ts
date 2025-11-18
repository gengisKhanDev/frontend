import { LoanStatus } from './loan.types'

export const LOAN_STATUS_CONFIG: Record<LoanStatus, {
	label: string
	variant: 'default' | 'secondary' | 'destructive'
}> = {
	pending: { label: 'pendiente', variant: 'secondary' },
	approved: { label: 'aprobado', variant: 'default' },
	rejected: { label: 'rechazado', variant: 'destructive' }
}
