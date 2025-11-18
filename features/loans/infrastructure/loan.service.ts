import loansData from '@/features/loans/infrastructure/mocks/loans.json'
import { Loan, LoanStatus, CreateLoanRequest } from '@/features/loans/domain/loan.types'

let loans: Loan[] = [...loansData]

export async function getLoansByUserId(userId: string): Promise<Loan[]> {
	await new Promise(resolve => setTimeout(resolve, 600))
	return loans.filter(loan => loan.userId === userId)
}

export async function getAllLoans(): Promise<Loan[]> {
	await new Promise(resolve => setTimeout(resolve, 600))
	return [...loans]
}

export async function createLoan(request: CreateLoanRequest): Promise<Loan> {
	await new Promise(resolve => setTimeout(resolve, 800))

	const newLoan: Loan = {
		id: `${Date.now()}`,
		...request,
		status: 'pending',
		requestDate: new Date().toISOString()
	}

	loans = [newLoan, ...loans]
	return newLoan
}

export async function updateLoanStatus(
	loanId: string,
	status: LoanStatus,
	reviewedBy: string
): Promise<Loan> {
	await new Promise(resolve => setTimeout(resolve, 800))

	const loanIndex = loans.findIndex(l => l.id === loanId)
	if (loanIndex === -1) {
		throw new Error('Préstamo no encontrado')
	}

	loans[loanIndex] = {
		...loans[loanIndex],
		status,
		reviewDate: new Date().toISOString(),
		reviewedBy
	}

	return loans[loanIndex]
}
