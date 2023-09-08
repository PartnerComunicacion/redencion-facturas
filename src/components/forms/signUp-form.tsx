'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { signUpSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { PasswordInput } from '@/components/password-input';

type Inputs = z.infer<typeof signUpSchema>;

export function SignUpForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<Inputs>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(data: Inputs) {
		setIsLoading(true);

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ data }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error);
			}

			form.reset();
			// router.push("/agregar-datos");
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar contraseña</FormLabel>
							<FormControl>
								<PasswordInput placeholder="**********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading}>
					{isLoading && <Icons.spinner className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
					Continuar
					<span className="sr-only">Continúa para la página de verificación de correo</span>
				</Button>
			</form>
		</Form>
	);
}
