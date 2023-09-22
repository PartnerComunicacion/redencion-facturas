'use client';

import { useState, useTransition } from 'react';
import type { FileWithPreview } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { uploadReceiptSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileDialog } from '@/components/file-dialog';
import { Icons } from '@/components/icons';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { isArrayOfFile } from '@/lib/utils';

type Inputs = z.infer<typeof uploadReceiptSchema>;

export function UploadReceiptForm() {
	const { toast } = useToast();

	const { data: session, status, update } = useSession();
	const email = session?.user?.email as string;
	const { data, isLoading } = trpc.user.getUserByEmail.useQuery({ email: email }, { enabled: status === 'authenticated' && !!email });
	const { useUploadThing } = generateReactHelpers<OurFileRouter>();
	const [files, setFiles] = useState<FileWithPreview[] | null>(null);
	const { isUploading, startUpload } = useUploadThing('productImage');
	const [isUpdating, setIsUpdating] = useState(false);
	const mutationUploadReceipt = trpc.receipts.addReceipt.useMutation();

	const form = useForm<Inputs>({
		resolver: zodResolver(uploadReceiptSchema),
		defaultValues: {
			id: '',
			value: '',
		},
	});

	async function onSubmit(formData: Inputs) {
		const { image, id, value } = formData;

		setIsUpdating(true);

		try {
			const images = isArrayOfFile(image)
				? await startUpload(image).then((res) => {
					const formattedImages = res?.map((image) => ({
						id: image.key,
						name: image.key.split('_')[1] ?? image.key,
						url: image.url,
					}));
					return formattedImages ?? null;
				})
				: null;

			if (images && data) {
				const imageUrl = images[0].url;
				await mutationUploadReceipt.mutateAsync({
					userId: data?.id,
					consecutive: id,
					value: value,
					imageUrl: imageUrl,
				});
			}

			console.log(images);
			form.reset();
			setFiles(null);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: `${error}`,
			});
		} finally {
			setIsUpdating(false);
		}
	}

	return (
		<Form {...form}>
			{isLoading ? (
				<div>Actualizando...</div>
			) : (
				<form className="grid gap-4" onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
					<FormField
						disabled={isUpdating}
						control={form.control}
						name="image"
						render={() => (
							<FormItem>
								<FormLabel>Foto de la factura</FormLabel>
								<FormControl>
									<FileDialog
										setValue={form.setValue}
										name="image"
										maxFiles={1}
										maxSize={1024 * 1024 * 4}
										files={files}
										setFiles={setFiles}
										isUploading={isUploading}
										disabled={isUploading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={isUpdating}
						control={form.control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número de factura</FormLabel>
								<FormControl>
									<Input placeholder="Cosmocentro-123" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={isUpdating}
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Valor total</FormLabel>
								<FormControl>
									<Input placeholder="10000" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="w-fit" disabled={isLoading || isUpdating}>
						{isLoading || isUpdating ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.send className="mr-2 h-4 w-4" />}
						Registrar factura
						<span className="sr-only">Enviar mensaje con un error</span>
					</Button>
				</form>
			)}
		</Form>
	);
}
