import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const passwordInput = z.object({
	email: z.string(),
	password: z.string(),
});

export const passwordRouter = router({
	hashPassword: publicProcedure.input(passwordInput).mutation(async ({ input }) => {
		const { email, password } = passwordInput.parse(input);

		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		const storedHashedPassword = user?.password;
		const isMatch = await bcrypt.compare(password, storedHashedPassword || '');

		return isMatch;
	}),

	updatePassword: publicProcedure.input(passwordInput).mutation(async ({ input }) => {
		const { email, password } = passwordInput.parse(input);

		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			await prisma.user.update({
				where: { email: email },
				data: { password: hashedPassword },
			});
		} catch (error) {
			console.error('Error detallado', error);
			throw new Error('Error al cambiar la contraseña');
		}
	}),
});
