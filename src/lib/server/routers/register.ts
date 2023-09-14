import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const passwordInput = z.object({
	email: z.string(),
	password: z.string(),
});

export const registerRouter = router({
	userRegister: publicProcedure.input(passwordInput).mutation(async ({ input }) => {
		const { email, password } = passwordInput.parse(input);

		const exist = await prisma.user.findUnique({
			where: { email: email },
		});

		if (exist) {
			throw new Error('Ya existe un usuario con ese email');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			await prisma.user.create({
				data: {
					email: email,
					password: hashedPassword,
					name: '',
					lastName: '',
					idType: '',
					personalId: '',
					phone: '',
				},
			});
			return { success: true, message: 'Usuario creado exitosamente' };
		} catch (error) {
			throw new Error('Error al crear el usuario');
		}
	}),
});
