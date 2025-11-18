import { Label } from '@/components/ui/label'
import { FormInput } from '@/components/atoms/form-input'
import { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	error?: string
	helperText?: string
}

export function FormField({ label, error, helperText, id, ...props }: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<FormInput id={id} error={error} {...props} />
			{error && (
				<p className="text-sm text-destructive">{error}</p>
			)}
			{helperText && !error && (
				<p className="text-xs text-muted-foreground">{helperText}</p>
			)}
		</div>
	)
}
