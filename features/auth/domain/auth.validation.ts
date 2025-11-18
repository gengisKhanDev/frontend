export interface ValidationResult {
	isValid: boolean
	error?: string
}

export const validateEmail = (email: string): ValidationResult => {
	if (!email) {
		return { isValid: false, error: 'El email es requerido' }
	}
	if (!/\S+@\S+\.\S+/.test(email)) {
		return { isValid: false, error: 'Email inválido' }
	}
	return { isValid: true }
}

export const validatePassword = (password: string): ValidationResult => {
	if (!password) {
		return { isValid: false, error: 'La contraseña es requerida' }
	}
	if (password.length < 3) {
		return { isValid: false, error: 'La contraseña debe tener al menos 3 caracteres' }
	}
	return { isValid: true }
}
