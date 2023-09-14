'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { onboardingSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UpdateProfileSkeleton } from '@/components/skeletons/update-profile-skeleton';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';

type Inputs = z.infer<typeof onboardingSchema>;

type IDType = 'Cédula de ciudadanía' | 'Pasaporte' | 'Cédula extranjera';

export function UpdateProfileForm() {
	const { toast } = useToast();
	const { data: session, status, update } = useSession();
	const email = session?.user?.email as string;
	const { data, isLoading } = trpc.user.getUserByEmail.useQuery({ email: email }, { enabled: status === 'authenticated' && !!email });
	const [isUpdating, setIsUpdating] = useState(false);
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

	useEffect(() => {
		if (data && !isLoading) {
			form.reset({
				name: data.name || '',
				lastName: data.lastName || '',
				idType: data.idType as IDType,
				id: data.personalId || '',
				phone: data.phone || '',
			});
		}
	}, [data, isLoading, form]);

	async function onSubmit(data: Inputs) {
		setIsUpdating(true);

		try {
			await update({
				name: data.name,
				lastName: data.lastName,
				idType: data.idType,
				personalId: data.id,
				phone: data.phone,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: `${error}`,
			});
		} finally {
			setIsUpdating(false);
		}
	}

	if (isLoading || !data) {
		return <UpdateProfileSkeleton />;
	}

	return (
		<Form {...form}>
			{isUpdating ? (
				<UpdateProfileSkeleton />
			) : (
				<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
					<FormField
						disabled={isLoading}
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
						disabled={isLoading}
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
						disabled={isLoading}
						control={form.control}
						name="idType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Selecciona el tipo de documento</FormLabel>
								<FormControl>
									<Select disabled={isLoading} value={field.value} onValueChange={(value: typeof field.value) => field.onChange(value)}>
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
						disabled={isLoading}
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
						disabled={isLoading}
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
