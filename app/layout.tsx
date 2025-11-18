import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/features/auth/application/auth.context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: 'Makers Bank - Sistema de Préstamos',
	description: 'Sistema de gestión de préstamos bancarios',
	generator: 'loan-service-front',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="es">
			<body className={`font-sans antialiased`}>
				<AuthProvider>
					{children}
				</AuthProvider>
				<Analytics />
			</body>
		</html>
	)
}
