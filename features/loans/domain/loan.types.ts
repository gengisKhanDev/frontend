export type LoanStatus = 'pending' | 'approved' | 'rejected'

export interface Loan {
	id: string
	userId: string
	userName: string
	userEmail: string
	amount: number
	term: number
	status: LoanStatus
	requestDate: string
	reviewDate?: string
	reviewedBy?: string
}

export interface CreateLoanRequest {
	userId: string
	userName: string
	userEmail: string
	amount: number
	term: number
}
