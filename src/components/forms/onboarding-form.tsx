'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { onboardingSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

type Inputs = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
	const { toast } = useToast();
	const router = useRouter();
	const { status, update } = useSession();

	const form = useForm<Inputs>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			name: '',
			lastName: '',
			idType: 'Cédula de ciudadanía',
			id: '',
			phone: '',
		},
	});

	async function onSubmit(data: Inputs) {
		try {
			console.log(data);
			update({
				name: data.name,
				lastName: data.lastName,
				idType: data.idType,
				personalId: data.id,
				phone: data.phone,
			});

			router.push('/registro');
		} catch (error) {
			toast({
				variant: 'destructive',
				title: `${error}`,
			});
		}
	}

	return (
		<Form {...form}>
			<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre</FormLabel>
							<FormControl>
								<Input placeholder="Pedro" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Apellidos</FormLabel>
							<FormControl>
								<Input placeholder="Duarte" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="idType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Selecciona el tipo de documento</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={(value: typeof field.value) => field.onChange(value)}>
									<SelectTrigger className="w-full shadow-none">
										<SelectValue placeholder={field.value} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="Cédula de ciudadanía">Cédula de ciudadanía</SelectItem>
											<SelectItem value="Pasaporte">Pasaporte</SelectItem>
											<SelectItem value="Cédula extranjera">Cédula extranjera</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número de documento</FormLabel>
							<FormControl>
								<Input placeholder="1234567890" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número de celular</FormLabel>
							<FormControl>
								<Input placeholder="3001234455" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={status === 'loading'}>
					{status === 'loading' && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
					Continuar
					<span className="sr-only">Continúa para la página de verificación de correo</span>
				</Button>
			</form>
		</Form>
	);
}
