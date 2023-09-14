import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { HomeLink } from '@/components/home-link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
	// const pathname = usePathname();
	// const { data: session, status } = useSession();

	// console.log(status);

	// if (status === 'loading')
	// 	return (
	// 		<div className="flex h-screen items-center justify-center bg-transparent">
	// 			<Loader2 className="h-12 w-12 animate-spin text-primary" />
	// 		</div>
	// 	);

	// if (session && pathname !== '/datos-personales') redirect('/perfil');
	const session = await getServerSession(authOptions);

	// if (session) {
	// 	if (!session.user?.name) {
	// 		redirect('/datos-personales');
	// 	}

	// 	console.log('Auth layout email', session.user?.name);

	// 	redirect('/perfil');
	// }

	return (
		<main className="grid h-screen overflow-hidden">
			<AspectRatio ratio={16 / 9} className="md:bg-background">
				<Image src="/stacked-steps.svg" alt="Fondo rectángulos" priority fill className="absolute inset-0 object-cover lg:hidden" />
				{/* {pathname !== '/datos-personales' ? (
					<Link className={cn('absolute left-8 top-8 z-20 flex items-center backdrop-blur-md', buttonVariants({ variant: 'link' }))} href="/">
						<Icons.arrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
						<p className="font-semibold tracking-wide">Regresar al incio</p>
					</Link>
				) : null} */}
				<HomeLink />
			</AspectRatio>
			<div className="absolute top-1/2 col-span-1 flex w-full -translate-y-1/2 items-center justify-center">{children}</div>
		</main>
	);
}
