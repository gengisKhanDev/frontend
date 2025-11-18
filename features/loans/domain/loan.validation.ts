export interface ValidationResult {
	isValid: boolean
	error?: string
}

export const LOAN_CONSTRAINTS = {
	MIN_AMOUNT: 1000,
	MAX_AMOUNT: 1000000,
	MIN_TERM: 6,
	MAX_TERM: 60
} as const

export const validateLoanAmount = (amount: number): ValidationResult => {
	if (isNaN(amount) || amount <= 0) {
		return { isValid: false, error: 'El monto es requerido' }
	}
	if (amount < LOAN_CONSTRAINTS.MIN_AMOUNT) {
		return { isValid: false, error: `El monto mínimo es $${LOAN_CONSTRAINTS.MIN_AMOUNT.toLocaleString()}` }
	}
	if (amount > LOAN_CONSTRAINTS.MAX_AMOUNT) {
		return { isValid: false, error: `El monto máximo es $${LOAN_CONSTRAINTS.MAX_AMOUNT.toLocaleString()}` }
	}
	return { isValid: true }
}

export const validateLoanTerm = (term: number): ValidationResult => {
	if (isNaN(term) || term <= 0) {
		return { isValid: false, error: 'El plazo es requerido' }
	}
	if (term < LOAN_CONSTRAINTS.MIN_TERM) {
		return { isValid: false, error: `El plazo mínimo es ${LOAN_CONSTRAINTS.MIN_TERM} meses` }
	}
	if (term > LOAN_CONSTRAINTS.MAX_TERM) {
		return { isValid: false, error: `El plazo máximo es ${LOAN_CONSTRAINTS.MAX_TERM} meses` }
	}
	return { isValid: true }
}
