import { Skeleton } from '@/components/ui/skeleton'

export function LoanListSkeleton() {
	return (
		<div className="space-y-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="flex items-center justify-between py-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</div>
			))}
		</div>
	)
}
