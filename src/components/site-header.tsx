'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SiteHeader() {
	const { data: session, status } = useSession();
	const router = useRouter();

	return (
		<div className="fixed left-0 right-0 z-40 flex h-14 w-full items-center justify-between gap-4 border-b bg-background px-6 py-4 md:px-12">
			<Link href="/" className="flex cursor-pointer items-center justify-center">
				<Icons.receipt className="mr-2 h-9 w-9 text-primary" />
				<h1 className="text-2xl">Redeen</h1>
			</Link>

			{session ? (
				<Button
					variant="outline"
					onClick={() => {
						signOut({
							redirect: false,
						});
						router.push('/');
					}}
				>
					Cerrar sesión
				</Button>
			) : (
				<Button variant={'outline'} onClick={() => router.push('/inicio-sesion')}>
					Iniciar sesión
				</Button>
			)}
		</div>
	);
}
