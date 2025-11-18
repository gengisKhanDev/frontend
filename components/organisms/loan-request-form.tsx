'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/molecules/form-field'
import { validateLoanAmount, validateLoanTerm, LOAN_CONSTRAINTS } from '@/features/loans/domain/loan.validation'
import { createLoan } from '@/features/loans/infrastructure/loan.service'
import { useAuth } from '@/features/auth/application/auth.context'
import { Loader2 } from 'lucide-react'

interface LoanRequestFormProps {
	onSuccess: () => void
}

export function LoanRequestForm({ onSuccess }: LoanRequestFormProps) {
	const { user } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const [formData, setFormData] = useState({
		amount: '',
		term: ''
	})

	const [errors, setErrors] = useState({
		amount: '',
		term: ''
	})

	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const minDate = tomorrow.toISOString().split('T')[0]

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const amount = parseFloat(formData.amount)

		let term = 0
		if (formData.term) {
			const selectedDate = new Date(formData.term)
			const today = new Date()
			const diffTime = selectedDate.getTime() - today.getTime()
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
			term = Math.ceil(diffDays / 30) // Convertir días a meses aproximados
		}

		const amountValidation = validateLoanAmount(amount)
		const termValidation = validateLoanTerm(term)

		if (!amountValidation.isValid || !termValidation.isValid) {
			setErrors({
				amount: amountValidation.error || '',
				term: termValidation.error || ''
			})
			return
		}

		if (!user) return

		setIsLoading(true)

		try {
			await createLoan({
				userId: user.id,
				userName: user.name,
				userEmail: user.email,
				amount,
				term
			})

			setFormData({ amount: '', term: '' })
			onSuccess()
		} catch (error) {
			console.error('[loan-service-front] Error creating loan:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (field: 'amount' | 'term') => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({ ...prev, [field]: e.target.value }))
		setErrors(prev => ({ ...prev, [field]: '' }))
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<FormField
				label="Monto"
				id="amount"
				type="number"
				placeholder="Monto"
				value={formData.amount}
				onChange={handleChange('amount')}
				disabled={isLoading}
				error={errors.amount}
			/>

			<FormField
				label="Plazo (fecha límite)"
				id="term"
				type="date"
				value={formData.term}
				onChange={handleChange('term')}
				disabled={isLoading}
				error={errors.term}
				min={minDate}
				helperText="Selecciona la fecha límite para el préstamo"
			/>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Solicitando...
					</>
				) : (
					'Solicitar'
				)}
			</Button>
		</form>
	)
}
