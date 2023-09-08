import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Crea tu cuenta',

			credentials: {
				email: {
					label: 'Correo electrónico',
					type: 'email',
				},
				password: { label: 'Contraseña', type: '********' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user) return null;

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

				if (!isPasswordValid) return null;

				return user;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
	pages: {
		signIn: '/inicio-sesion',
		error: '/api/auth/error',
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
