import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const GetUserByEmailInput = z.object({
	email: z.string(),
});

export const userRouter = router({
	getUserByEmail: publicProcedure.input(GetUserByEmailInput).query(async ({ input }) => {
		const { email } = GetUserByEmailInput.parse(input);

		if (!email) {
			throw new Error('El email es requerido.');
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user) {
			throw new Error('Usuario no encontrado.');
		}

		return user;
	}),
});
