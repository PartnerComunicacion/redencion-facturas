'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function HomeLink() {
	const pathname = usePathname();
	return (
		<div className="flex h-full items-center justify-center">
			<Link className={cn(pathname !== '/datos-personales' ? 'absolute flex left-8 top-8 z-20 items-center backdrop-blur-md' : 'hidden', buttonVariants({ variant: 'link' }))} href="/">
				<Icons.arrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
				<p className="font-semibold tracking-wide">Regresar al incio</p>
			</Link>
		</div>
	);
}
