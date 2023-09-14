import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OnboardingForm } from '@/components/forms/onboarding-form';
import { Shell } from '@/components/shell';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
	const session = await getServerSession(authOptions);

	if (session && session.user?.name) {
		redirect('/perfil');
	}
	return (
		<Shell className="mx-auto max-w-md">
			<div className="flex w-full items-center justify-center">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8B8B8]">
					<p className="text-primary-foreground">1</p>
				</div>
				<Separator className="mx-4 w-10 bg-[#B8B8B8]" />
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
					<p className="text-primary-foreground">2</p>
				</div>
			</div>
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-center text-2xl">Completa tus datos</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
					</div>
					<OnboardingForm />
					{/* <Button variant={"outline"}><Icons.google className="w-4 h-4 mr-2" /> Regístrate con Google</Button> */}
				</CardContent>
			</Card>
		</Shell>
	);
}
