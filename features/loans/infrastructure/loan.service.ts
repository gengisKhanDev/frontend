'use client'

import { Loan, LoanStatus, CreateLoanRequest } from '@/features/loans/domain/loan.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

const AUTH_STORAGE_KEY = 'loan-app-auth'

type BackendLoanDto = {
	id: number | string
	userId: number | string
	userName: string
	userEmail: string
	amount: number
	term: number
	status: string
	requestDate: string
	reviewDate?: string | null
	reviewedBy?: string | null
}

/**
 * Leer el token guardado por el AuthProvider.
 * Guardamos en localStorage:
 *   key: "loan-app-auth"
 *   value: { token: "Base64(email:password)" }
 */
function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null

	const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
	if (!raw) return null

	try {
		const parsed = JSON.parse(raw) as { token?: string }
		return parsed.token ?? null
	} catch (error) {
		console.error('[loan-service-front] Error parsing auth storage:', error)
		return null
	}
}

/**
 * Headers de Authorization con Basic Auth
 */
function getAuthHeaders(): HeadersInit {
	const token = getAuthToken()
	if (!token) return {}

	return {
		Authorization: `Basic ${token}`,
	}
}

/**
 * Mapear el DTO del backend a tu tipo de dominio Loan
 */
function mapBackendLoan(dto: BackendLoanDto): Loan {
	const {
		id,
		userId,
		userName,
		userEmail,
		amount,
		term,
		status,
		requestDate,
		reviewDate,
		reviewedBy,
	} = dto

	const loan: Loan = {
		id: String(id),
		userId: String(userId),
		userName,
		userEmail,
		amount,
		term,
		status: status as LoanStatus,
		requestDate,
	}

	if (reviewDate) {
		loan.reviewDate = reviewDate
	}

	if (reviewedBy) {
		loan.reviewedBy = reviewedBy
	}

	return loan
}

/**
 * Manejo genérico de respuestas del backend
 */
async function handleResponse<T>(res: Response): Promise<T> {
	if (res.status === 401) {
		throw new Error('No autorizado. Inicia sesión nuevamente.')
	}

	if (!res.ok) {
		let message = 'Error al comunicarse con el servidor'

		try {
			const data = await res.json()
			if (data && typeof data === 'object' && 'message' in data) {
				message = (data as any).message
			}
		} catch {
			// ignoramos errores de parseo de JSON
		}

		throw new Error(message)
	}

	return (await res.json()) as T
}

/**
 * Obtener todos los préstamos (vista admin)
 */
export async function getAllLoans(): Promise<Loan[]> {
	const res = await fetch(`${API_BASE_URL}/api/loans`, {
		method: 'GET',
		headers: {
			...getAuthHeaders(),
			Accept: 'application/json',
		},
		cache: 'no-store',
	})

	const data = await handleResponse<BackendLoanDto[]>(res)
	return data.map(mapBackendLoan)
}

/**
 * Obtener préstamos por usuario (vista user)
 * Filtramos en front usando el userId del Loan
 */
export async function getLoansByUserId(userId: string): Promise<Loan[]> {
	const all = await getAllLoans()
	return all.filter(loan => loan.userId === userId)
}

/**
 * Crear préstamo
 * El backend solo recibe { amount, term }.
 * Los datos de usuario los pone el backend con el usuario autenticado.
 */
export async function createLoan(request: CreateLoanRequest): Promise<Loan> {
	const res = await fetch(`${API_BASE_URL}/api/loans`, {
		method: 'POST',
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			amount: request.amount,
			term: request.term,
		}),
	})

	const data = await handleResponse<BackendLoanDto>(res)
	return mapBackendLoan(data)
}

/**
 * Actualizar estado del préstamo (aprobación / rechazo)
 */
export async function updateLoanStatus(
	loanId: string,
	status: LoanStatus,
	_reviewedBy: string,
): Promise<Loan> {
	const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}/approval`, {
		method: 'POST',
		headers: {
			...getAuthHeaders(),
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			approved: status === 'approved',
		}),
	})

	const data = await handleResponse<BackendLoanDto>(res)
	return mapBackendLoan(data)
}
