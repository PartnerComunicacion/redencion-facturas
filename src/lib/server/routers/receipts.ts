import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const receiptInput = z.object({
	userId: z.string(),
	consecutive: z.string(),
	value: z.string(),
	imageUrl: z.string(),
});

export const receiptsRouter = router({
	addReceipt: publicProcedure.input(receiptInput).mutation(async ({ input }) => {
		const { userId, consecutive, value, imageUrl } = receiptInput.parse(input);

		const exist = await prisma.receipt.findUnique({
			where: { consecutive: consecutive },
		});

		if (exist) {
			throw new Error('Ya existe una factura con ese consecutivo');
		}

		try {
			await prisma.receipt.create({
				data: {
					userId: userId,
					imageUrl: imageUrl,
					consecutive: consecutive,
					value: parseFloat(value),
					state: 'Por revisión',
				},
			});
			return { success: true, message: 'Factura agregada exitosamente' };
		} catch (error) {
			throw new Error('No se pudo agregar la factura');
		}
	}),

	getReceipts: publicProcedure
		.input(
			z.object({
				userId: z.string(),
			})
		)
		.query(async ({ input }) => {
			const { userId } = input;

			if (userId) {
				try {
					const receipts = await prisma.receipt.findMany({
						where: {
							userId: userId,
						},
						select: {
							id: true,
							imageUrl: true,
							state: true,
							consecutive: true,
							value: true,
							userId: true,
						},
					});

					return receipts;
				} catch (error) {
					throw new Error('No se pudieron obtener las facturas');
				}
			}

			return { message: 'Aún no hay un usuario' };
		}),

	updateReceipt: publicProcedure
		.input(
			z.object({
				id: z.string(),
				consecutive: z.string(),
				value: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, consecutive, value } = input;

			try {
				const updatedReceipt = await prisma.receipt.update({
					where: { id: id },
					data: {
						consecutive: consecutive,
						value: value,
					},
				});

				return { success: true, message: 'Factura actualizada exitosamente', receipt: updatedReceipt };
			} catch (error) {
				throw new Error('No se pudo actualizar la factura');
			}
		}),
	deleteReceipt: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const { id } = input;

			try {
				const deletedReceipt = await prisma.receipt.delete({
					where: { id: id },
				});

				return { success: true, message: 'Factura eliminada exitosamente', receipt: deletedReceipt };
			} catch (error) {
				throw new Error('No se pudo eliminar la factura');
			}
		}),
});
