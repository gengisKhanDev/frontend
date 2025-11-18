import { InputHTMLAttributes, forwardRef } from 'react'
import { Input } from '@/components/ui/input'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ error, className, ...props }, ref) => {
		return (
			<Input
				ref={ref}
				className={`${error ? 'border-destructive' : ''} ${className || ''}`}
				{...props}
			/>
		)
	}
)

FormInput.displayName = 'FormInput'
