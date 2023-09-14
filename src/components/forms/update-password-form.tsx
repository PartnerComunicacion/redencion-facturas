'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { newPasswordSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { UpdatePasswordSkeleton } from '@/components/skeletons/update-password-skeleton';

type Inputs = z.infer<typeof newPasswordSchema>;

export function UpdatePasswordForm() {
	const { toast } = useToast();
	const { data: session, status, update } = useSession();
	const email = session?.user?.email as string;
	const { data, isLoading } = trpc.user.getUserByEmail.useQuery({ email: email }, { enabled: status === 'authenticated' && !!email });
	const mutationHashPassword = trpc.password.hashPassword.useMutation();
	const mutationUpdatePassword = trpc.password.updatePassword.useMutation();
	const [isUpdating, setIsUpdating] = useState(false);

	const form = useForm<Inputs>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: '',
			newPassword: '',
			confirmNewPassword: '',
		},
	});

	async function onSubmit(formData: Inputs) {
		setIsUpdating(true);

		const { password, newPassword } = formData;

		if (!data || !data.email) return;

		const { email } = data;

		try {
			const isMatch = await mutationHashPassword.mutateAsync({ email, password });

			if (isMatch) {
				try {
					await mutationUpdatePassword.mutateAsync({ email, password: newPassword });

					toast({
						title: 'Contraseña actualizada exitosamente',
					});
				} catch (error) {
					toast({
						variant: 'destructive',
						title: `${error}`,
					});
				}
			} else {
				toast({
					variant: 'destructive',
					title: 'La contraseña es incorrecta',
				});
			}
		} catch (error) {
			console.log(error);
			toast({
				variant: 'destructive',
				title: `${error}`,
			});
		} finally {
			form.reset();
			setIsUpdating(false);
		}
	}

	return (
		<Form {...form}>
			{isUpdating ? (
				<UpdatePasswordSkeleton />
			) : (
				<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
					<FormField
						disabled={isLoading}
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña actual</FormLabel>
								<FormControl>
									<PasswordInput placeholder="**********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						disabled={isLoading}
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nueva contraseña</FormLabel>
								<FormControl>
									<PasswordInput placeholder="**********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						disabled={isLoading}
						control={form.control}
						name="confirmNewPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirmar nueva contraseña</FormLabel>
								<FormControl>
									<PasswordInput placeholder="**********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className="w-fit" disabled={isLoading}>
						{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
						Guardar cambios
						<span className="sr-only">Guardar los cambios del perfil</span>
					</Button>
				</form>
			)}
		</Form>
	);
}
