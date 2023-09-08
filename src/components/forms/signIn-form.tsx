'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { signInSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';
import { signIn } from 'next-auth/react';

type Inputs = z.infer<typeof signInSchema>;

export function SignInForm() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<Inputs>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(data: Inputs) {
		setIsLoading(true);
		try {
			// await new Promise((resolve) => setTimeout(resolve, 250));
			signIn('credentials', { ...data, redirect: false });
			console.log(data);
			// form.reset();
			// router.push('/perfil');
		} catch (error) {
			toast({
				variant: 'destructive',
				title: `${error}`,
			});
		}

		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Correo</FormLabel>
							<FormControl>
								<Input placeholder="correo@gmail.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<PasswordInput placeholder="**********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading}>
					{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
					Iniciar sesión
					<span className="sr-only">Iniciar sesión</span>
				</Button>
			</form>
		</Form>
	);
}
