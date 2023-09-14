import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function UpdateProfileSkeleton() {
	return (
		<div className="grid gap-6">
			<div className="grid gap-2">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="grid gap-2">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="grid gap-2">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="grid gap-2">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="grid gap-2">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-10 w-full" />
			</div>
			<Button className="w-fit" disabled>
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
				Guardar cambios
				<span className="sr-only">Guardar los cambios del perfil</span>
			</Button>
		</div>
	);
}
