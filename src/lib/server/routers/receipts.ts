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
});
